export interface DistrictData {
  name: string;
  isDhaka: boolean;
  thanas: string[];
}

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  {
    name: 'Dhaka',
    isDhaka: true,
    thanas: [
      'Gulshan',
      'Banani',
      'Dhanmondi',
      'Uttara',
      'Mirpur',
      'Mohammadpur',
      'Badda',
      'Baridhara',
      'Bashundhara R/A',
      'Motijheel',
      'Paltan',
      'Ramna',
      'Shahbagh',
      'Tejgaon',
      'Khilgaon',
      'Malibagh',
      'Shantinagar',
      'Lalbagh',
      'Old Dhaka (Kotwali)',
      'Sutrapur',
      'Jatrabari',
      'Demra',
      'Savar',
      'Keraniganj',
      'Dhamrai',
      'Ashulia',
      'Cantonment',
      'Kafrul',
      'Pallabi',
      'Rampura',
      'Vatara',
      'Mohakhali DOHS',
      'Mirpur DOHS',
      'Baridhara DOHS'
    ]
  },
  {
    name: 'Gazipur',
    isDhaka: false,
    thanas: ['Gazipur Sadar', 'Tongi', 'Sreepur', 'Kaliakair', 'Kapasia', 'Kaliganj']
  },
  {
    name: 'Narayanganj',
    isDhaka: false,
    thanas: ['Narayanganj Sadar', 'Bandar', 'Fatullah', 'Siddhirganj', 'Rupganj', 'Araihazar', 'Sonargaon']
  },
  {
    name: 'Chittagong (Chattogram)',
    isDhaka: false,
    thanas: [
      'Khulshi',
      'Panchlaish',
      'Agrabad',
      'Nasirabad',
      'GEC Circle',
      'Halishahar',
      'Kotwali',
      'Pahartali',
      'Bakalia',
      'Chandgaon',
      'Patenga',
      'Double Mooring',
      'Hathazari',
      'Sitakunda',
      'Patiya',
      'Raozan',
      'Fatikchhari'
    ]
  },
  {
    name: 'Sylhet',
    isDhaka: false,
    thanas: ['Sylhet Sadar', 'Zindabazar', 'Amberkhana', 'Upashahar', 'South Surma', 'Beanibazar', 'Golapganj', 'Osmani Nagar', 'Fenchuganj']
  },
  {
    name: 'Rajshahi',
    isDhaka: false,
    thanas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Chandrima', 'Paba', 'Godagari', 'Bagha', 'Charghat']
  },
  {
    name: 'Khulna',
    isDhaka: false,
    thanas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Rupsha', 'Dighalia', 'Batiaghata']
  },
  {
    name: 'Cox\'s Bazar',
    isDhaka: false,
    thanas: ['Cox\'s Bazar Sadar', 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Pekua', 'Kutubdia', 'Maheshkhali']
  },
  {
    name: 'Barisal (Barishal)',
    isDhaka: false,
    thanas: ['Kotwali', 'Airport', 'Bandar', 'Bakerganj', 'Babuganj', 'Gournadi', 'Agailjhara', 'Wazirpur']
  },
  {
    name: 'Rangpur',
    isDhaka: false,
    thanas: ['Kotwali', 'Mahiganj', 'Parshuram', 'Haragach', 'Tajhat', 'Badarganj', 'Gangachara', 'Mithapukur', 'Pirganj']
  },
  {
    name: 'Mymensingh',
    isDhaka: false,
    thanas: ['Kotwali (Mymensingh Sadar)', 'Muktagacha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gaffargaon', 'Ishwarganj']
  },
  {
    name: 'Comilla (Cumilla)',
    isDhaka: false,
    thanas: ['Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Chandina', 'Daudkandi', 'Debidwar', 'Laksam', 'Burichang', 'Muradnagar']
  },
  {
    name: 'Brahmanbaria',
    isDhaka: false,
    thanas: ['Brahmanbaria Sadar', 'Ashuganj', 'Kasba', 'Nabinagar', 'Sarail', 'Akhaura', 'Bancharampur']
  },
  {
    name: 'Bogura (Bogra)',
    isDhaka: false,
    thanas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Dhunat', 'Kahaloo', 'Nandigram']
  },
  {
    name: 'Jessore (Jashore)',
    isDhaka: false,
    thanas: ['Jashore Sadar', 'Jhikargachha', 'Chaugachha', 'Abhaynagar', 'Bagherpara', 'Keshabpur', 'Manirampur']
  },
  {
    name: 'Noakhali',
    isDhaka: false,
    thanas: ['Noakhali Sadar (Sudharam)', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Sonaimuri', 'Subarnachar']
  },
  {
    name: 'Feni',
    isDhaka: false,
    thanas: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Fulgazi', 'Sonagazi']
  },
  {
    name: 'Tangail',
    isDhaka: false,
    thanas: ['Tangail Sadar', 'Mirzapur', 'Kalihati', 'Gopalpur', 'Ghatail', 'Madhupur', 'Sakhipur', 'Basail']
  },
  {
    name: 'Narsingdi',
    isDhaka: false,
    thanas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Belabo', 'Monohardi', 'Raipura']
  },
  {
    name: 'Munshiganj',
    isDhaka: false,
    thanas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria']
  },
  {
    name: 'Manikganj',
    isDhaka: false,
    thanas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya', 'Ghior', 'Harirampur', 'Daulatpur']
  },
  {
    name: 'Faridpur',
    isDhaka: false,
    thanas: ['Faridpur Sadar', 'Boalmari', 'Madhukhali', 'Nagarkanda', 'Bhanga', 'Sadarpur', 'Alfadanga']
  },
  {
    name: 'Dinajpur',
    isDhaka: false,
    thanas: ['Dinajpur Sadar', 'Birganj', 'Biral', 'Birol', 'Parbatipur', 'Phulbari', 'Hakimpur']
  },
  {
    name: 'Pabna',
    isDhaka: false,
    thanas: ['Pabna Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Chatmohar', 'Bera', 'Bhangura']
  },
  {
    name: 'Kushtia',
    isDhaka: false,
    thanas: ['Kushtia Sadar', 'Kumarkhali', 'Bheramara', 'Mirpur', 'Daulatpur', 'Khoksa']
  },
  {
    name: 'Jamalpur',
    isDhaka: false,
    thanas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Dewanganj', 'Bakshiganj', 'Madarganj']
  },
  {
    name: 'Kishoreganj',
    isDhaka: false,
    thanas: ['Kishoreganj Sadar', 'Bhairab', 'Kuliarchar', 'Bajitpur', 'Katiadi', 'Pakundia', 'Hossainpur', 'Karimganj']
  },
  {
    name: 'Sirajganj',
    isDhaka: false,
    thanas: ['Sirajganj Sadar', 'Ullapara', 'Shahjadpur', 'Belkuchi', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Tarash']
  },
  {
    name: 'Panchagarh',
    isDhaka: false,
    thanas: ['Panchagarh Sadar', 'Boda', 'Debiganj', 'Atwari', 'Tetulia']
  },
  {
    name: 'Sunamganj',
    isDhaka: false,
    thanas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Tahirpur', 'Jamalganj']
  },
  {
    name: 'Habiganj',
    isDhaka: false,
    thanas: ['Habiganj Sadar', 'Madhabpur', 'Nabiganj', 'Chunarughat', 'Bahubal', 'Baniachong']
  },
  {
    name: 'Moulvibazar',
    isDhaka: false,
    thanas: ['Moulvibazar Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Barlekha', 'Rajnagar', 'Juri']
  },
  {
    name: 'Satkhira',
    isDhaka: false,
    thanas: ['Satkhira Sadar', 'Tala', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Assasuni', 'Debhata']
  }
];
