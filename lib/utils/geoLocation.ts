/**
 * GPS 좌표를 한국 행정구역(도/시군구)으로 변환하는 유틸리티
 *
 * 방식: 각 행정구역의 중심점 좌표와 사용자 위치 간 거리를 계산하여
 * 가장 가까운 지역을 반환합니다.
 */

import { PROVINCE_NAMES, CITY_NAMES } from '@/types/audio'

export interface GeoLocation {
  latitude: number
  longitude: number
}

export interface RegionInfo {
  province: string      // 도 ID (예: 'gangwon')
  city: string         // 시군구 ID (예: 'taebaek')
  provinceName: string // 도 한글명
  cityName: string     // 시군구 한글명
}

// 시군구별 중심 좌표 (위도, 경도)
// 주요 지역만 포함 - 필요시 확장 가능
const CITY_COORDINATES: Record<string, Record<string, GeoLocation>> = {
  // 강원도
  gangwon: {
    chuncheon: { latitude: 37.8813, longitude: 127.7300 },
    wonju: { latitude: 37.3422, longitude: 127.9202 },
    gangneung: { latitude: 37.7519, longitude: 128.8761 },
    sokcho: { latitude: 38.2070, longitude: 128.5918 },
    donghae: { latitude: 37.5247, longitude: 129.1143 },
    samcheok: { latitude: 37.4500, longitude: 129.1650 },
    taebaek: { latitude: 37.1640, longitude: 128.9856 },
    hongcheon: { latitude: 37.6972, longitude: 127.8886 },
    hoengseong: { latitude: 37.4914, longitude: 127.9850 },
    yeongwol: { latitude: 37.1836, longitude: 128.4617 },
    pyeongchang: { latitude: 37.3708, longitude: 128.3900 },
    jeongseon: { latitude: 37.3806, longitude: 128.6608 },
    cheorwon: { latitude: 38.1467, longitude: 127.3133 },
    hwacheon: { latitude: 38.1061, longitude: 127.7081 },
    yanggu: { latitude: 38.1100, longitude: 127.9897 },
    inje: { latitude: 38.0697, longitude: 128.1706 },
    goseong: { latitude: 38.3800, longitude: 128.4678 },
    yangyang: { latitude: 38.0753, longitude: 128.6189 },
  },
  // 경기도
  gyeonggi: {
    suwon: { latitude: 37.2636, longitude: 127.0286 },
    seongnam: { latitude: 37.4200, longitude: 127.1267 },
    goyang: { latitude: 37.6584, longitude: 126.8320 },
    yongin: { latitude: 37.2411, longitude: 127.1776 },
    bucheon: { latitude: 37.5034, longitude: 126.7660 },
    ansan: { latitude: 37.3219, longitude: 126.8309 },
    anyang: { latitude: 37.3943, longitude: 126.9568 },
    namyangju: { latitude: 37.6360, longitude: 127.2165 },
    hwaseong: { latitude: 37.1997, longitude: 126.8312 },
    pyeongtaek: { latitude: 36.9921, longitude: 127.0857 },
    uijeongbu: { latitude: 37.7381, longitude: 127.0337 },
    siheung: { latitude: 37.3800, longitude: 126.8028 },
    paju: { latitude: 37.7599, longitude: 126.7800 },
    gimpo: { latitude: 37.6153, longitude: 126.7156 },
    gwangmyeong: { latitude: 37.4786, longitude: 126.8644 },
    gwangju_gg: { latitude: 37.4095, longitude: 127.2550 },
    gunpo: { latitude: 37.3617, longitude: 126.9353 },
    hanam: { latitude: 37.5392, longitude: 127.2147 },
    osan: { latitude: 37.1499, longitude: 127.0770 },
    icheon: { latitude: 37.2792, longitude: 127.4350 },
    anseong: { latitude: 37.0078, longitude: 127.2797 },
    uiwang: { latitude: 37.3447, longitude: 126.9683 },
    yangpyeong: { latitude: 37.4917, longitude: 127.4875 },
    yeoju: { latitude: 37.2986, longitude: 127.6364 },
    gwacheon: { latitude: 37.4292, longitude: 126.9875 },
    guri: { latitude: 37.5942, longitude: 127.1297 },
    pocheon: { latitude: 37.8947, longitude: 127.2003 },
    dongducheon: { latitude: 37.9036, longitude: 127.0606 },
    yangju: { latitude: 37.7853, longitude: 127.0458 },
    gapyeong: { latitude: 37.8314, longitude: 127.5097 },
    yeoncheon: { latitude: 38.0964, longitude: 127.0753 },
  },
  // 서울
  seoul: {
    jongno: { latitude: 37.5735, longitude: 126.9790 },
    jung: { latitude: 37.5640, longitude: 126.9975 },
    yongsan: { latitude: 37.5326, longitude: 126.9906 },
    seongdong: { latitude: 37.5633, longitude: 127.0371 },
    gwangjin: { latitude: 37.5385, longitude: 127.0823 },
    dongdaemun: { latitude: 37.5744, longitude: 127.0396 },
    jungnang: { latitude: 37.6063, longitude: 127.0928 },
    seongbuk: { latitude: 37.5894, longitude: 127.0167 },
    gangbuk: { latitude: 37.6396, longitude: 127.0255 },
    dobong: { latitude: 37.6688, longitude: 127.0471 },
    nowon: { latitude: 37.6542, longitude: 127.0568 },
    eunpyeong: { latitude: 37.6027, longitude: 126.9291 },
    seodaemun: { latitude: 37.5791, longitude: 126.9368 },
    mapo: { latitude: 37.5663, longitude: 126.9014 },
    yangcheon: { latitude: 37.5170, longitude: 126.8666 },
    gangseo: { latitude: 37.5509, longitude: 126.8495 },
    guro: { latitude: 37.4954, longitude: 126.8874 },
    geumcheon: { latitude: 37.4519, longitude: 126.9020 },
    yeongdeungpo: { latitude: 37.5264, longitude: 126.8963 },
    dongjak: { latitude: 37.5124, longitude: 126.9393 },
    gwanak: { latitude: 37.4784, longitude: 126.9516 },
    seocho: { latitude: 37.4837, longitude: 127.0324 },
    gangnam: { latitude: 37.5172, longitude: 127.0473 },
    songpa: { latitude: 37.5145, longitude: 127.1059 },
    gangdong: { latitude: 37.5301, longitude: 127.1238 },
  },
  // 인천
  incheon: {
    jung_ic: { latitude: 37.4736, longitude: 126.6214 },
    dong_ic: { latitude: 37.4744, longitude: 126.6433 },
    michuhol: { latitude: 37.4639, longitude: 126.6503 },
    yeonsu: { latitude: 37.4100, longitude: 126.6784 },
    namdong: { latitude: 37.4469, longitude: 126.7310 },
    bupyeong: { latitude: 37.5066, longitude: 126.7219 },
    gyeyang: { latitude: 37.5373, longitude: 126.7375 },
    seo_ic: { latitude: 37.5453, longitude: 126.6760 },
    ganghwa: { latitude: 37.7467, longitude: 126.4878 },
    ongjin: { latitude: 37.4469, longitude: 126.6369 },
  },
  // 대전
  daejeon: {
    dong_dj: { latitude: 36.3121, longitude: 127.4549 },
    jung_dj: { latitude: 36.3254, longitude: 127.4212 },
    seo_dj: { latitude: 36.3549, longitude: 127.3837 },
    yuseong: { latitude: 36.3622, longitude: 127.3561 },
    daedeok: { latitude: 36.3467, longitude: 127.4156 },
  },
  // 대구
  daegu: {
    jung_dg: { latitude: 35.8690, longitude: 128.6059 },
    dong_dg: { latitude: 35.8867, longitude: 128.6353 },
    seo_dg: { latitude: 35.8719, longitude: 128.5592 },
    nam_dg: { latitude: 35.8460, longitude: 128.5972 },
    buk_dg: { latitude: 35.8858, longitude: 128.5828 },
    suseong: { latitude: 35.8581, longitude: 128.6306 },
    dalseo: { latitude: 35.8299, longitude: 128.5327 },
    dalseong: { latitude: 35.7744, longitude: 128.4311 },
  },
  // 광주
  gwangju: {
    dong_gj: { latitude: 35.1461, longitude: 126.9227 },
    seo_gj: { latitude: 35.1520, longitude: 126.8895 },
    nam_gj: { latitude: 35.1328, longitude: 126.9025 },
    buk_gj: { latitude: 35.1741, longitude: 126.9122 },
    gwangsan: { latitude: 35.1396, longitude: 126.7936 },
  },
  // 울산
  ulsan: {
    jung_us: { latitude: 35.5681, longitude: 129.3320 },
    nam_us: { latitude: 35.5444, longitude: 129.3311 },
    dong_us: { latitude: 35.5050, longitude: 129.4161 },
    buk_us: { latitude: 35.5828, longitude: 129.3611 },
    ulju: { latitude: 35.5231, longitude: 129.0994 },
  },
  // 부산
  busan: {
    jung_bs: { latitude: 35.1064, longitude: 129.0324 },
    seo_bs: { latitude: 35.0978, longitude: 129.0241 },
    dong_bs: { latitude: 35.1296, longitude: 129.0453 },
    yeongdo: { latitude: 35.0910, longitude: 129.0678 },
    busanjin: { latitude: 35.1631, longitude: 129.0533 },
    dongnae: { latitude: 35.1979, longitude: 129.0682 },
    nam_bs: { latitude: 35.1368, longitude: 129.0850 },
    buk_bs: { latitude: 35.1972, longitude: 128.9903 },
    haeundae: { latitude: 35.1631, longitude: 129.1635 },
    saha: { latitude: 35.1046, longitude: 128.9747 },
    geumjeong: { latitude: 35.2431, longitude: 129.0922 },
    gangseo_bs: { latitude: 35.2120, longitude: 128.9808 },
    yeonje: { latitude: 35.1761, longitude: 129.0800 },
    suyeong: { latitude: 35.1458, longitude: 129.1128 },
    sasang: { latitude: 35.1525, longitude: 128.9917 },
    gijang: { latitude: 35.2444, longitude: 129.2222 },
  },
  // 세종
  sejong: {
    sejong_city: { latitude: 36.4800, longitude: 127.2890 },
  },
  // 충청북도
  chungbuk: {
    cheongju: { latitude: 36.6424, longitude: 127.4890 },
    chungju: { latitude: 36.9910, longitude: 127.9259 },
    jecheon: { latitude: 37.1326, longitude: 128.1910 },
    boeun: { latitude: 36.4897, longitude: 127.7292 },
    okcheon: { latitude: 36.3061, longitude: 127.5711 },
    yeongdong: { latitude: 36.1750, longitude: 127.7836 },
    jincheon: { latitude: 36.8553, longitude: 127.4356 },
    goesan: { latitude: 36.8147, longitude: 127.7867 },
    eumseong: { latitude: 36.9397, longitude: 127.6903 },
    danyang: { latitude: 36.9847, longitude: 128.3653 },
    jeungpyeong: { latitude: 36.7856, longitude: 127.5858 },
  },
  // 충청남도
  chungnam: {
    cheonan: { latitude: 36.8151, longitude: 127.1139 },
    gongju: { latitude: 36.4467, longitude: 127.1192 },
    boryeong: { latitude: 36.3333, longitude: 126.6128 },
    asan: { latitude: 36.7897, longitude: 127.0017 },
    seosan: { latitude: 36.7850, longitude: 126.4503 },
    nonsan: { latitude: 36.1869, longitude: 127.0986 },
    gyeryong: { latitude: 36.2744, longitude: 127.2486 },
    dangjin: { latitude: 36.8897, longitude: 126.6458 },
    geumsan: { latitude: 36.1086, longitude: 127.4878 },
    buyeo: { latitude: 36.2758, longitude: 126.9097 },
    seocheon: { latitude: 36.0781, longitude: 126.6914 },
    cheongyang: { latitude: 36.4592, longitude: 126.8022 },
    hongseong: { latitude: 36.6011, longitude: 126.6650 },
    yesan: { latitude: 36.6806, longitude: 126.8444 },
    taean: { latitude: 36.7456, longitude: 126.2978 },
  },
  // 전북특별자치도
  jeonbuk: {
    jeonju: { latitude: 35.8242, longitude: 127.1480 },
    gunsan: { latitude: 35.9676, longitude: 126.7369 },
    iksan: { latitude: 35.9483, longitude: 126.9576 },
    jeongeup: { latitude: 35.5699, longitude: 126.8558 },
    namwon: { latitude: 35.4164, longitude: 127.3903 },
    gimje: { latitude: 35.8039, longitude: 126.8808 },
    wanju: { latitude: 35.9022, longitude: 127.1600 },
    jinan: { latitude: 35.7914, longitude: 127.4247 },
    muju: { latitude: 35.9222, longitude: 127.6606 },
    jangsu: { latitude: 35.6472, longitude: 127.5214 },
    imsil: { latitude: 35.6178, longitude: 127.2892 },
    sunchang: { latitude: 35.3742, longitude: 127.1375 },
    gochang: { latitude: 35.4358, longitude: 126.7019 },
    buan: { latitude: 35.7319, longitude: 126.7331 },
  },
  // 전라남도
  jeonnam: {
    mokpo: { latitude: 34.8118, longitude: 126.3922 },
    yeosu: { latitude: 34.7604, longitude: 127.6622 },
    suncheon: { latitude: 34.9506, longitude: 127.4875 },
    naju: { latitude: 35.0156, longitude: 126.7108 },
    gwangyang: { latitude: 34.9406, longitude: 127.6956 },
    damyang: { latitude: 35.3211, longitude: 126.9881 },
    gokseong: { latitude: 35.2819, longitude: 127.2917 },
    gurye: { latitude: 35.2028, longitude: 127.4625 },
    goheung: { latitude: 34.6117, longitude: 127.2850 },
    boseong: { latitude: 34.7711, longitude: 127.0797 },
    hwasun: { latitude: 35.0644, longitude: 126.9867 },
    jangheung: { latitude: 34.6817, longitude: 126.9069 },
    gangjin: { latitude: 34.6419, longitude: 126.7672 },
    haenam: { latitude: 34.5739, longitude: 126.5994 },
    yeongam: { latitude: 34.8003, longitude: 126.6969 },
    muan: { latitude: 34.9903, longitude: 126.4817 },
    hampyeong: { latitude: 35.0656, longitude: 126.5175 },
    yeonggwang: { latitude: 35.2772, longitude: 126.5119 },
    jangseong: { latitude: 35.3017, longitude: 126.7847 },
    wando: { latitude: 34.3108, longitude: 126.7550 },
    jindo: { latitude: 34.4869, longitude: 126.2639 },
    sinan: { latitude: 34.8283, longitude: 126.1078 },
  },
  // 경상북도
  gyeongbuk: {
    pohang: { latitude: 36.0190, longitude: 129.3435 },
    gyeongju: { latitude: 35.8562, longitude: 129.2247 },
    gimcheon: { latitude: 36.1198, longitude: 128.1136 },
    andong: { latitude: 36.5684, longitude: 128.7296 },
    gumi: { latitude: 36.1195, longitude: 128.3444 },
    yeongju: { latitude: 36.8058, longitude: 128.6239 },
    yeongcheon: { latitude: 35.9733, longitude: 128.9386 },
    sangju: { latitude: 36.4108, longitude: 128.1589 },
    mungyeong: { latitude: 36.5867, longitude: 128.1867 },
    gyeongsan: { latitude: 35.8253, longitude: 128.7369 },
    uiseong: { latitude: 36.3528, longitude: 128.6972 },
    cheongsong: { latitude: 36.4361, longitude: 129.0572 },
    yeongyang: { latitude: 36.6669, longitude: 129.1125 },
    yeongdeok: { latitude: 36.4150, longitude: 129.3656 },
    cheongdo: { latitude: 35.6472, longitude: 128.7339 },
    goryeong: { latitude: 35.7264, longitude: 128.2636 },
    seongju: { latitude: 35.9189, longitude: 128.2833 },
    chilgok: { latitude: 35.9953, longitude: 128.4017 },
    yecheon: { latitude: 36.6581, longitude: 128.4519 },
    bonghwa: { latitude: 36.8931, longitude: 128.7322 },
    uljin: { latitude: 36.9931, longitude: 129.4003 },
    ulleung: { latitude: 37.4842, longitude: 130.9058 },
  },
  // 경상남도
  gyeongnam: {
    changwon: { latitude: 35.2280, longitude: 128.6811 },
    jinju: { latitude: 35.1798, longitude: 128.1076 },
    tongyeong: { latitude: 34.8544, longitude: 128.4331 },
    sacheon: { latitude: 35.0037, longitude: 128.0642 },
    gimhae: { latitude: 35.2286, longitude: 128.8892 },
    miryang: { latitude: 35.4914, longitude: 128.7486 },
    geoje: { latitude: 34.8806, longitude: 128.6211 },
    yangsan: { latitude: 35.3350, longitude: 129.0372 },
    uiryeong: { latitude: 35.3222, longitude: 128.2569 },
    haman: { latitude: 35.2722, longitude: 128.4069 },
    changnyeong: { latitude: 35.5444, longitude: 128.4917 },
    goseong_gn: { latitude: 34.9728, longitude: 128.3228 },
    namhae: { latitude: 34.8375, longitude: 127.8925 },
    hadong: { latitude: 35.0672, longitude: 127.7514 },
    sancheong: { latitude: 35.4147, longitude: 127.8736 },
    hamyang: { latitude: 35.5203, longitude: 127.7250 },
    geochang: { latitude: 35.6861, longitude: 127.9097 },
    hapcheon: { latitude: 35.5667, longitude: 128.1656 },
  },
  // 제주
  jeju: {
    jeju_city: { latitude: 33.4996, longitude: 126.5312 },
    seogwipo: { latitude: 33.2541, longitude: 126.5604 },
  },
}

/**
 * 두 좌표 사이의 거리를 계산 (Haversine 공식)
 * @returns 거리 (km)
 */
function calculateDistance(loc1: GeoLocation, loc2: GeoLocation): number {
  const R = 6371 // 지구 반경 (km)
  const dLat = toRad(loc2.latitude - loc1.latitude)
  const dLon = toRad(loc2.longitude - loc1.longitude)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * GPS 좌표로부터 가장 가까운 시군구를 찾습니다
 * @param location 사용자의 현재 위치
 * @returns 가장 가까운 지역 정보 (없으면 null)
 */
export function findNearestCity(location: GeoLocation): RegionInfo | null {
  let nearestProvince = ''
  let nearestCity = ''
  let minDistance = Infinity

  for (const [province, cities] of Object.entries(CITY_COORDINATES)) {
    for (const [city, coords] of Object.entries(cities)) {
      const distance = calculateDistance(location, coords)
      if (distance < minDistance) {
        minDistance = distance
        nearestProvince = province
        nearestCity = city
      }
    }
  }

  if (!nearestProvince || !nearestCity) {
    return null
  }

  return {
    province: nearestProvince,
    city: nearestCity,
    provinceName: PROVINCE_NAMES[nearestProvince] || nearestProvince,
    cityName: CITY_NAMES[nearestCity] || nearestCity,
  }
}

/**
 * 특정 도 내에서 가장 가까운 시군구를 찾습니다
 * @param location 사용자의 현재 위치
 * @param province 검색할 도 ID
 * @returns 가장 가까운 시군구 ID (없으면 null)
 */
export function findNearestCityInProvince(
  location: GeoLocation,
  province: string
): string | null {
  const cities = CITY_COORDINATES[province]
  if (!cities) return null

  let nearestCity = ''
  let minDistance = Infinity

  for (const [city, coords] of Object.entries(cities)) {
    const distance = calculateDistance(location, coords)
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city
    }
  }

  return nearestCity || null
}

/**
 * GPS 좌표가 한국 영토 내에 있는지 확인
 */
export function isInKorea(location: GeoLocation): boolean {
  // 한반도 대략적 범위 (남한 기준)
  const MIN_LAT = 33.0
  const MAX_LAT = 38.6
  const MIN_LNG = 124.5
  const MAX_LNG = 131.0

  return (
    location.latitude >= MIN_LAT &&
    location.latitude <= MAX_LAT &&
    location.longitude >= MIN_LNG &&
    location.longitude <= MAX_LNG
  )
}

/**
 * 현재 위치를 가져오는 Promise 래퍼
 * 먼저 고정밀 GPS를 시도하고, 실패하면 네트워크 기반으로 폴백
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS_NOT_SUPPORTED'))
      return
    }

    // 먼저 고정밀 GPS 시도 (모바일에서 더 정확)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ 고정밀 GPS 성공')
        resolve(position)
      },
      (highAccuracyError) => {
        console.log('⚠️ 고정밀 GPS 실패, 네트워크 기반으로 폴백')
        // 고정밀 실패 시 네트워크 기반으로 폴백
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('✅ 네트워크 기반 위치 성공')
            resolve(position)
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('GPS_PERMISSION_DENIED'))
                break
              case error.POSITION_UNAVAILABLE:
                reject(new Error('GPS_POSITION_UNAVAILABLE'))
                break
              case error.TIMEOUT:
                reject(new Error('GPS_TIMEOUT'))
                break
              default:
                reject(new Error('GPS_UNKNOWN_ERROR'))
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          }
        )
      },
      {
        enableHighAccuracy: true, // 먼저 고정밀 시도
        timeout: 8000, // 8초 내에 안되면 폴백
        maximumAge: 60000,
      }
    )
  })
}
