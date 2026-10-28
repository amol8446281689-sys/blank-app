import { CropPrice } from '../types';

export interface CityLocation {
  nameMr: string;
  nameEn: string;
  lat: number;
  lon: number;
  districtMr: string;
  districtEn: string;
}

export const MAHARASHTRA_CITIES: CityLocation[] = [
  { nameMr: 'पुणे', nameEn: 'Pune', lat: 18.5204, lon: 73.8567, districtMr: 'पुणे', districtEn: 'Pune' },
  { nameMr: 'मुंबई', nameEn: 'Mumbai', lat: 19.0760, lon: 72.8777, districtMr: 'मुंबई', districtEn: 'Mumbai' },
  { nameMr: 'नाशिक', nameEn: 'Nashik', lat: 19.9975, lon: 73.7898, districtMr: 'नाशिक', districtEn: 'Nashik' },
  { nameMr: 'नागपूर', nameEn: 'Nagpur', lat: 21.1458, lon: 79.0882, districtMr: 'नागपूर', districtEn: 'Nagpur' },
  { nameMr: 'छत्रपती संभाजीनगर', nameEn: 'Chh. Sambhajinagar', lat: 19.8762, lon: 75.3433, districtMr: 'छत्रपती संभाजीनगर', districtEn: 'Aurangabad' },
  { nameMr: 'कोल्हापूर', nameEn: 'Kolhapur', lat: 16.7050, lon: 74.2433, districtMr: 'कोल्हापूर', districtEn: 'Kolhapur' },
  { nameMr: 'सोलापूर', nameEn: 'Solapur', lat: 17.6599, lon: 75.9064, districtMr: 'सोलापूर', districtEn: 'Solapur' },
  { nameMr: 'सातारा', nameEn: 'Satara', lat: 17.6805, lon: 73.9997, districtMr: 'सातारा', districtEn: 'Satara' },
  { nameMr: 'अहमदनगर', nameEn: 'Ahilyanagar', lat: 19.0952, lon: 74.7480, districtMr: 'अहिल्यानगर', districtEn: 'Ahilyanagar' },
  { nameMr: 'सांगली', nameEn: 'Sangli', lat: 16.8524, lon: 74.5815, districtMr: 'सांगली', districtEn: 'Sangli' },
  { nameMr: 'अमरावती', nameEn: 'Amravati', lat: 20.9374, lon: 77.7796, districtMr: 'अमरावती', districtEn: 'Amravati' },
  { nameMr: 'जळगाव', nameEn: 'Jalgaon', lat: 21.0077, lon: 75.5626, districtMr: 'जळगाव', districtEn: 'Jalgaon' },
  { nameMr: 'लातूर', nameEn: 'Latur', lat: 18.4088, lon: 76.5604, districtMr: 'लातूर', districtEn: 'Latur' },
  { nameMr: 'नांदेड', nameEn: 'Nanded', lat: 19.1383, lon: 77.3210, districtMr: 'नांदेड', districtEn: 'Nanded' },
  { nameMr: 'रत्नागिरी', nameEn: 'Ratnagiri', lat: 16.9902, lon: 73.3120, districtMr: 'रत्नागिरी', districtEn: 'Ratnagiri' }
];

export const INITIAL_CROPS: CropPrice[] = [
  {
    nameMr: 'कांदा (Onion)',
    nameEn: 'Onion',
    unit: 'क्विंटल (₹/Quintal)',
    minPrice: 1650,
    maxPrice: 2850,
    avgPrice: 2250,
    change: 4.8,
    topMarketMr: 'लासलगाव (नाशिक)',
    topMarketEn: 'Lasalgaon (Nashik)',
    trend: 'up'
  },
  {
    nameMr: 'सोयाबीन (Soybean)',
    nameEn: 'Soybean',
    unit: 'क्विंटल (₹/Quintal)',
    minPrice: 4200,
    maxPrice: 4750,
    avgPrice: 4520,
    change: -1.2,
    topMarketMr: 'लातूर',
    topMarketEn: 'Latur',
    trend: 'down'
  },
  {
    nameMr: 'कापूस (Cotton)',
    nameEn: 'Cotton',
    unit: 'क्विंटल (₹/Quintal)',
    minPrice: 7100,
    maxPrice: 7650,
    avgPrice: 7420,
    change: 2.1,
    topMarketMr: 'जळगाव / अमरावती',
    topMarketEn: 'Jalgaon / Amravati',
    trend: 'up'
  },
  {
    nameMr: 'तूर (Pigeon Pea)',
    nameEn: 'Tur / Arhar',
    unit: 'क्विंटल (₹/Quintal)',
    minPrice: 9400,
    maxPrice: 10800,
    avgPrice: 10100,
    change: 0.8,
    topMarketMr: 'अकोला / वाशीम',
    topMarketEn: 'Akola / Washim',
    trend: 'stable'
  },
  {
    nameMr: 'गहू (Wheat)',
    nameEn: 'Wheat',
    unit: 'क्विंटल (₹/Quintal)',
    minPrice: 2400,
    maxPrice: 3100,
    avgPrice: 2750,
    change: 1.5,
    topMarketMr: 'पुणे कृषी उत्पन्न बाजार',
    topMarketEn: 'Pune APMC',
    trend: 'up'
  },
  {
    nameMr: 'डाळिंब (Pomegranate)',
    nameEn: 'Pomegranate',
    unit: 'क्विंटल (₹/Quintal)',
    minPrice: 6500,
    maxPrice: 14500,
    avgPrice: 10500,
    change: 5.6,
    topMarketMr: 'सोलापूर / सांगोला',
    topMarketEn: 'Solapur / Sangola',
    trend: 'up'
  },
  {
    nameMr: 'टोमॅटो (Tomato)',
    nameEn: 'Tomato',
    unit: 'क्रेट (२० किलो)',
    minPrice: 320,
    maxPrice: 580,
    avgPrice: 460,
    change: -3.4,
    topMarketMr: 'नारायणगाव (पुणे)',
    topMarketEn: 'Narayangaon (Pune)',
    trend: 'down'
  },
  {
    nameMr: 'ऊस (Sugarcane)',
    nameEn: 'Sugarcane',
    unit: 'टन (FRP दर)',
    minPrice: 2950,
    maxPrice: 3350,
    avgPrice: 3150,
    change: 0.0,
    topMarketMr: 'कोल्हापूर / सांगली',
    topMarketEn: 'Kolhapur / Sangli',
    trend: 'stable'
  }
];

export const FESTIVALS_MARATHI = [
  { nameMr: 'गुढीपाडवा (मराठी नववर्ष)', nameEn: 'Gudi Padwa', descMr: 'चैत्र शुद्ध प्रतिपदा - नवीन संकल्प व समृद्धीची सुरुवात' },
  { nameMr: 'महाराष्ट्र दिन व कामगार दिन', nameEn: 'Maharashtra Day', descMr: '१ मे - संयुक्त महाराष्ट्र स्थापना दिन' },
  { nameMr: 'बेंदूर / पोळा', nameEn: 'Bail Pola', descMr: 'बळीराजाचा सोबती सर्जा-राजा (बैल) कृतज्ञता सण' },
  { nameMr: 'गणेशोत्सव', nameEn: 'Ganeshotsav', descMr: 'भाद्रपद शुद्ध चतुर्थी - लाडक्या बाप्पाचे आगमन' },
  { nameMr: 'दसरा (विजयादशमी)', nameEn: 'Dussehra', descMr: 'अश्विन शुद्ध दशमी - आपट्याची पाने व विजयाची परंपरा' },
  { nameMr: 'दिवाळी (दीपावली)', nameEn: 'Diwali', descMr: 'वसुबारस, धनत्रयोदशी, लक्ष्मीपूजन, पाडवा आणि भाऊबीज' },
  { nameMr: 'शिवजयंती', nameEn: 'Shiv Jayanti', descMr: 'छत्रपती शिवाजी महाराज जन्मोत्सव - शौर्य व स्वाभिमानाचा दिवस' }
];

export const LAND_UNITS = [
  { id: 'guntha', nameMr: 'गुंठा (Guntha)', nameEn: 'Guntha', toSqFt: 1089 },
  { id: 'acre', nameMr: 'एकर (Acre)', nameEn: 'Acre', toSqFt: 43560 }, // 40 gunthas
  { id: 'hectare', nameMr: 'हेक्टर (Hectare)', nameEn: 'Hectare', toSqFt: 107639 }, // ~2.471 acres
  { id: 'sqft', nameMr: 'चौरस फूट (Sq. Feet)', nameEn: 'Sq. Feet', toSqFt: 1 },
  { id: 'sqmeter', nameMr: 'चौरस मीटर (Sq. Meter)', nameEn: 'Sq. Meter', toSqFt: 10.7639 },
  { id: 'bigha', nameMr: 'बिघा (Bigha)', nameEn: 'Bigha', toSqFt: 24000 },
  { id: 'aar', nameMr: 'आर (Aar)', nameEn: 'Aar', toSqFt: 1076.39 }
];
