import React, { useRef, useState } from 'react';
import { Download, Printer, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Order, SiteSettings } from '../../types.ts';

interface InvoiceProps {
  order: Order;
  settings?: SiteSettings;
  onClose?: () => void;
  showDownloadButton?: boolean;
}

export const Invoice: React.FC<InvoiceProps> = ({
  order,
  settings,
  onClose,
  showDownloadButton = true
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Safe formatting helpers
  const orderNumber = order.orderNumber || (order.id ? String(order.id).slice(0, 8) : '001');
  const invoiceNumber = `AEVY-INV-${orderNumber.padStart(3, '0')}`;
  
  // Format Date (e.g. 18 AUG 2026)
  const orderDate = (() => {
    try {
      const d = order.createdAt ? new Date(order.createdAt) : new Date();
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase();
    } catch {
      return '18 AUG 2026';
    }
  })();

  const subtotal = Number(order.subtotal || 0);
  const deliveryCharge = Number(order.deliveryCharge || 0);
  const discount = Number(order.discount || 0);
  const grandTotal = Number(order.total || Math.max(0, subtotal + deliveryCharge - discount));

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // PDF Download Handler using html2pdf.js
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPdf(true);
    setPdfError(null);

    try {
      // Dynamic import for html2pdf.js
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      const element = invoiceRef.current;
      const filename = `AEVY-Invoice-${orderNumber}.pdf`;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#FAF8F5'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err: any) {
      console.error('PDF download error:', err);
      setPdfError('PDF generator encountered a minor issue. You can also click Print to Save as PDF directly.');
      // Fallback: trigger browser print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Action Bar */}
      {showDownloadButton && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161616] p-4 border border-[#2A2A2A] rounded-sm print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8A96A]" />
            <span className="text-xs uppercase tracking-widest text-[#F5F1E8] font-medium">
              Official Tax & Dispatch Invoice ({invoiceNumber})
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-transparent border border-[#3A3A3A] text-[#F5F1E8] text-xs uppercase tracking-wider font-semibold hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-2 bg-[#C8A96A] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold hover:bg-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Invoice (PDF)'}</span>
            </button>
          </div>
        </div>
      )}

      {pdfError && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{pdfError}</span>
        </div>
      )}

      {/* Printable Invoice Container */}
      <div className="overflow-x-auto flex justify-center py-2">
        <div
          id="aevy-printable-invoice"
          ref={invoiceRef}
          className="w-full max-w-[780px] bg-[#FAF8F5] text-[#111111] font-sans p-8 sm:p-12 shadow-2xl border border-[#E8E2D6] relative print:shadow-none print:border-none print:p-6 print:max-w-none print:w-full"
          style={{ minHeight: '1000px', backgroundColor: '#FAF8F5', color: '#111111' }}
        >
          {/* Subtle Champagne Gold Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#C8A96A]" />

          {/* 1. Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E0D8C8] pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-medium text-[#111111] uppercase">
                AEVY
              </h1>
              <p className="text-[10px] tracking-[0.35em] text-[#C8A96A] uppercase font-semibold mt-1">
                {settings?.tagline || 'ESSENCE OF FRESH ELEGANCE'}
              </p>
              <p className="text-[10px] text-[#666666] tracking-wider mt-0.5 font-light">
                Artisanal Flacons • Small-Batch Extrait de Parfum
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-widest font-light block">
                INVOICE
              </span>
              <p className="text-xs font-semibold text-[#C8A96A] tracking-wider mt-0.5">
                {invoiceNumber}
              </p>
              <p className="text-[11px] text-[#555555] tracking-wide mt-0.5">
                Date: <strong className="text-[#111111] font-medium">{orderDate}</strong>
              </p>
            </div>
          </div>

          {/* 2. Order Metadata & Bill To Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-[#E0D8C8] pb-8 mb-8 text-xs">
            {/* Left: Bill To */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888] font-semibold block">
                BILL TO / RECIPIENT
              </span>
              <p className="font-serif text-base font-bold text-[#111111]">
                {order.customerName || 'Valued Patron'}
              </p>
              <p className="text-[#444444] font-medium">
                Phone: <span className="text-[#111111] font-semibold">{order.phone}</span>
              </p>
              {order.email && (
                <p className="text-[#555555]">Email: {order.email}</p>
              )}
              <div className="text-[#444444] pt-1 leading-relaxed">
                <p className="font-medium text-[#222222]">
                  {order.thana ? `${order.thana}, ` : ''}{order.district || 'Dhaka'}
                </p>
                <p className="text-[#555555]">{order.fullAddress}</p>
              </div>
            </div>

            {/* Right: Order Specifics */}
            <div className="space-y-2 bg-[#F3EFE6] p-4 border border-[#E5DEC9] sm:text-right">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888] font-semibold block">
                ORDER PARTICULARS
              </span>
              
              <div className="flex justify-between sm:justify-end gap-3 text-xs">
                <span className="text-[#666666]">Order Ref:</span>
                <span className="font-serif font-bold text-[#111111] tracking-wider text-sm">
                  {orderNumber}
                </span>
              </div>

              <div className="flex justify-between sm:justify-end gap-3 text-xs">
                <span className="text-[#666666]">Payment Method:</span>
                <span className="font-semibold text-[#111111] uppercase tracking-wide">
                  {order.paymentMethod || 'Cash on Delivery'}
                </span>
              </div>

              <div className="flex justify-between sm:justify-end gap-3 text-xs">
                <span className="text-[#666666]">Dispatch Status:</span>
                <span className="inline-block px-2 py-0.5 bg-[#111111] text-[#FAF8F5] text-[10px] font-semibold tracking-widest uppercase">
                  {order.status || 'Confirmed'}
                </span>
              </div>

              {order.note && (
                <div className="pt-2 border-t border-[#DFD6C2] text-left sm:text-right">
                  <span className="text-[10px] text-[#777777] uppercase tracking-wider block">Instructions:</span>
                  <span className="text-[11px] text-[#333333] italic font-light">{order.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Items Table */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-[#111111] bg-[#F1ECE0]">
                  <th className="py-3 px-3 uppercase tracking-[0.15em] font-semibold text-[#111111] text-[10px]">
                    FRAGRANCE SELECTION
                  </th>
                  <th className="py-3 px-2 uppercase tracking-[0.15em] font-semibold text-[#111111] text-[10px] text-center">
                    FLACON / SIZE
                  </th>
                  <th className="py-3 px-2 uppercase tracking-[0.15em] font-semibold text-[#111111] text-[10px] text-center">
                    QTY
                  </th>
                  <th className="py-3 px-3 uppercase tracking-[0.15em] font-semibold text-[#111111] text-[10px] text-right">
                    UNIT PRICE
                  </th>
                  <th className="py-3 px-3 uppercase tracking-[0.15em] font-semibold text-[#111111] text-[10px] text-right">
                    LINE TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0D8C8]">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => {
                    const itemQty = Number(item.quantity || 1);
                    const itemPrice = Number(item.unitPrice || 0);
                    const lineTotal = itemQty * itemPrice;

                    return (
                      <tr key={idx} className="hover:bg-[#F5F0E4]/60 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-serif font-semibold text-sm text-[#111111]">
                            {item.productName || 'AEVY Artisanal Fragrance'}
                          </p>
                          <p className="text-[10px] text-[#777777] tracking-wider uppercase mt-0.5">
                            Extrait de Parfum • High Longevity
                          </p>
                        </td>
                        <td className="py-3.5 px-2 text-center text-[#444444] font-medium">
                          {item.size || '30ml'} {item.bottleShape ? `(${item.bottleShape})` : ''}
                        </td>
                        <td className="py-3.5 px-2 text-center font-bold text-[#111111]">
                          {itemQty}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-[#333333]">
                          ৳ {itemPrice.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right font-serif font-bold text-[#111111] text-sm">
                          ৳ {lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-3 text-center text-[#777777] italic">
                      Standard Fragrance Package
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 4. Financial Calculations & Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-t-2 border-[#111111] pt-6 mb-8 text-xs">
            {/* Left: Notes & Signature */}
            <div className="w-full sm:w-1/2 space-y-3">
              <div className="p-3.5 bg-[#F3EFE6] border-l-2 border-[#C8A96A]">
                <p className="font-serif text-xs font-semibold text-[#111111]">
                  Authenticity & Handling Guarantee
                </p>
                <p className="text-[11px] text-[#555555] mt-1 leading-relaxed font-light">
                  Hand-inspected before dispatch. Every flacon contains concentrated extrait oils designed for enduring sillage.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-widest text-[#888888]">Payment Notice:</p>
                <p className="text-[11px] font-medium text-[#222222]">
                  Pay courier in cash upon arrival. No advance payment required for COD.
                </p>
              </div>
            </div>

            {/* Right: Totals Box */}
            <div className="w-full sm:w-1/2 space-y-2 bg-[#F3EFE6] p-5 border border-[#E5DEC9]">
              <div className="flex justify-between text-[#555555]">
                <span>Fragrance Subtotal:</span>
                <span className="font-medium text-[#111111]">৳ {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-[#555555]">
                <span>Courier Delivery Charge:</span>
                <span className="font-medium text-[#111111]">
                  {deliveryCharge === 0 ? 'COMPLIMENTARY' : `৳ ${deliveryCharge.toLocaleString()}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#996515] font-medium">
                  <span>Promotional Privilege ({order.couponCode || 'PROMO'}):</span>
                  <span>-৳ {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-base sm:text-lg font-serif font-bold text-[#111111] pt-3 border-t-2 border-[#111111] mt-2">
                <span className="uppercase tracking-wider">Total Payable:</span>
                <span className="text-[#111111]">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 5. Luxury Brand Footer */}
          <div className="border-t border-[#E0D8C8] pt-6 text-center space-y-2 text-[10px] text-[#666666]">
            <p className="font-serif text-xs uppercase tracking-[0.2em] text-[#111111] font-semibold">
              AEVY ARTISANAL PERFUMERY
            </p>
            <p className="tracking-wider">
              Narayanganj, Dhaka, Bangladesh • Dedicated Concierge: {settings?.contactPhone || '01629927898'} • {settings?.contactEmail || 'concierge@aevyfragrance.com'}
            </p>
            <p className="text-[9px] text-[#888888] tracking-widest uppercase pt-1">
              Thank you for trusting AEVY with your olfactive signature.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
