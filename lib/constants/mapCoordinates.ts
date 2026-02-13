/**
 * 지도 관련 좌표 및 줌 레벨 상수
 *
 * 17개 시도 중심 좌표, 시군구 좌표, Leaflet 줌 레벨을 정의합니다.
 */

// 한국 중심 좌표
export const KOREA_CENTER = { lat: 36.0, lng: 127.5 }

// 한국 전체를 보여주는 bounds [남서쪽, 북동쪽]
// 한국 본토 + 제주도만 꽉 차게 (울릉도 제외)
export const KOREA_BOUNDS: [[number, number], [number, number]] = [
  [33.0, 126.0],  // 남서쪽 (제주도 남쪽)
  [38.7, 129.6],  // 북동쪽 (강원도 북쪽)
]

// Leaflet 줌 레벨
export const MAP_ZOOM = {
  KOREA: 7,     // 전국 뷰
  PROVINCE: 9,  // 시도 뷰
} as const

// 17개 시도 마커 표시 좌표
// 줌 6.5에서 겹침 방지를 위해 지리적 중심에서 미세 조정됨
// (각 마커는 해당 시도 영역 내에 위치)
export const PROVINCE_CENTERS: Record<string, { lat: number; lng: number }> = {
  seoul: { lat: 37.68, lng: 127.05 },      // 수도권: 북쪽으로 분리
  gyeonggi: { lat: 37.50, lng: 127.55 },   // 수도권: 동쪽 유지
  incheon: { lat: 37.38, lng: 126.60 },     // 수도권: 남서쪽으로 분리
  gangwon: { lat: 37.82, lng: 128.16 },     // 단독 - 조정 없음
  chungbuk: { lat: 36.75, lng: 127.65 },    // 충청: 북동쪽으로 분리
  chungnam: { lat: 36.35, lng: 126.55 },    // 충청: 남서쪽으로 분리
  sejong: { lat: 36.58, lng: 127.00 },      // 충청: 서쪽으로 분리
  daejeon: { lat: 36.25, lng: 127.40 },     // 충청: 남쪽으로 분리
  jeonbuk: { lat: 35.72, lng: 127.15 },     // 단독 - 조정 없음
  jeonnam: { lat: 34.70, lng: 126.95 },     // 전라: 남쪽으로 분리
  gwangju: { lat: 35.22, lng: 126.80 },     // 전라: 북서쪽으로 분리
  gyeongbuk: { lat: 36.49, lng: 128.89 },   // 단독 - 조정 없음
  gyeongnam: { lat: 35.46, lng: 128.21 },   // 단독 - 조정 없음
  daegu: { lat: 35.87, lng: 128.60 },       // 단독 - 조정 없음
  ulsan: { lat: 35.60, lng: 129.35 },       // 경상남부: 북동쪽으로 분리
  busan: { lat: 35.10, lng: 129.05 },       // 경상남부: 남쪽으로 분리
  jeju: { lat: 33.49, lng: 126.50 },        // 단독 - 조정 없음
}

// 시군구별 중심 좌표 (Leaflet용 lat/lng 형식)
// geoLocation.ts의 CITY_COORDINATES와 동일한 데이터
export const CITY_COORDINATES_MAP: Record<string, Record<string, { lat: number; lng: number }>> = {
  gangwon: {
    chuncheon: { lat: 37.8813, lng: 127.7300 },
    wonju: { lat: 37.3422, lng: 127.9202 },
    gangneung: { lat: 37.7519, lng: 128.8761 },
    sokcho: { lat: 38.2070, lng: 128.5918 },
    donghae: { lat: 37.5500, lng: 129.1143 },   // 삼척과 겹침 방지: 북쪽으로 이동
    samcheok: { lat: 37.4200, lng: 129.1650 },   // 동해와 겹침 방지: 남쪽으로 이동
    taebaek: { lat: 37.1640, lng: 128.9856 },
    hongcheon: { lat: 37.6972, lng: 127.8886 },
    hoengseong: { lat: 37.4914, lng: 127.9850 },
    yeongwol: { lat: 37.1836, lng: 128.4617 },
    pyeongchang: { lat: 37.3708, lng: 128.3900 },
    jeongseon: { lat: 37.3806, lng: 128.6608 },
    cheorwon: { lat: 38.1467, lng: 127.3133 },
    hwacheon: { lat: 38.1061, lng: 127.7081 },
    yanggu: { lat: 38.1100, lng: 127.9897 },
    inje: { lat: 38.0697, lng: 128.1706 },
    goseong: { lat: 38.3800, lng: 128.4678 },
    yangyang: { lat: 38.0753, lng: 128.6189 },
  },
  gyeonggi: {
    suwon: { lat: 37.2636, lng: 127.0286 },
    seongnam: { lat: 37.4200, lng: 127.1267 },
    goyang: { lat: 37.6584, lng: 126.8320 },
    yongin: { lat: 37.2411, lng: 127.1776 },
    bucheon: { lat: 37.5034, lng: 126.7660 },
    ansan: { lat: 37.3219, lng: 126.8309 },
    anyang: { lat: 37.3943, lng: 126.9568 },
    namyangju: { lat: 37.6360, lng: 127.2165 },
    hwaseong: { lat: 37.1997, lng: 126.8312 },
    pyeongtaek: { lat: 36.9921, lng: 127.0857 },
    uijeongbu: { lat: 37.7381, lng: 127.0337 },
    siheung: { lat: 37.3800, lng: 126.8028 },
    paju: { lat: 37.7599, lng: 126.7800 },
    gimpo: { lat: 37.6153, lng: 126.7156 },
    gwangmyeong: { lat: 37.4786, lng: 126.8644 },
    gwangju_gg: { lat: 37.4095, lng: 127.2550 },
    gunpo: { lat: 37.3617, lng: 126.9353 },
    hanam: { lat: 37.5392, lng: 127.2147 },
    osan: { lat: 37.1499, lng: 127.0770 },
    icheon: { lat: 37.2792, lng: 127.4350 },
    anseong: { lat: 37.0078, lng: 127.2797 },
    uiwang: { lat: 37.3447, lng: 126.9683 },
    yangpyeong: { lat: 37.4917, lng: 127.4875 },
    yeoju: { lat: 37.2986, lng: 127.6364 },
    gwacheon: { lat: 37.4292, lng: 126.9875 },
    guri: { lat: 37.5942, lng: 127.1297 },
    pocheon: { lat: 37.8947, lng: 127.2003 },
    dongducheon: { lat: 37.9036, lng: 127.0606 },
    yangju: { lat: 37.7853, lng: 127.0458 },
    gapyeong: { lat: 37.8314, lng: 127.5097 },
    yeoncheon: { lat: 38.0964, lng: 127.0753 },
  },
  seoul: {
    jongno: { lat: 37.5735, lng: 126.9790 },
    jung: { lat: 37.5640, lng: 126.9975 },
    yongsan: { lat: 37.5326, lng: 126.9906 },
    seongdong: { lat: 37.5633, lng: 127.0371 },
    gwangjin: { lat: 37.5385, lng: 127.0823 },
    dongdaemun: { lat: 37.5744, lng: 127.0396 },
    jungnang: { lat: 37.6063, lng: 127.0928 },
    seongbuk: { lat: 37.5894, lng: 127.0167 },
    gangbuk: { lat: 37.6396, lng: 127.0255 },
    dobong: { lat: 37.6688, lng: 127.0471 },
    nowon: { lat: 37.6542, lng: 127.0568 },
    eunpyeong: { lat: 37.6027, lng: 126.9291 },
    seodaemun: { lat: 37.5791, lng: 126.9368 },
    mapo: { lat: 37.5663, lng: 126.9014 },
    yangcheon: { lat: 37.5170, lng: 126.8666 },
    gangseo: { lat: 37.5509, lng: 126.8495 },
    guro: { lat: 37.4954, lng: 126.8874 },
    geumcheon: { lat: 37.4519, lng: 126.9020 },
    yeongdeungpo: { lat: 37.5264, lng: 126.8963 },
    dongjak: { lat: 37.5124, lng: 126.9393 },
    gwanak: { lat: 37.4784, lng: 126.9516 },
    seocho: { lat: 37.4837, lng: 127.0324 },
    gangnam: { lat: 37.5172, lng: 127.0473 },
    songpa: { lat: 37.5145, lng: 127.1059 },
    gangdong: { lat: 37.5301, lng: 127.1238 },
  },
  incheon: {
    jung_ic: { lat: 37.4736, lng: 126.6214 },
    dong_ic: { lat: 37.4744, lng: 126.6433 },
    michuhol: { lat: 37.4639, lng: 126.6503 },
    yeonsu: { lat: 37.4100, lng: 126.6784 },
    namdong: { lat: 37.4469, lng: 126.7310 },
    bupyeong: { lat: 37.5066, lng: 126.7219 },
    gyeyang: { lat: 37.5373, lng: 126.7375 },
    seo_ic: { lat: 37.5453, lng: 126.6760 },
    ganghwa: { lat: 37.7467, lng: 126.4878 },
    ongjin: { lat: 37.4469, lng: 126.6369 },
  },
  daejeon: {
    dong_dj: { lat: 36.3121, lng: 127.4549 },
    jung_dj: { lat: 36.3254, lng: 127.4212 },
    seo_dj: { lat: 36.3549, lng: 127.3837 },
    yuseong: { lat: 36.3622, lng: 127.3561 },
    daedeok: { lat: 36.3467, lng: 127.4156 },
  },
  daegu: {
    jung_dg: { lat: 35.8690, lng: 128.6059 },
    dong_dg: { lat: 35.8867, lng: 128.6353 },
    seo_dg: { lat: 35.8719, lng: 128.5592 },
    nam_dg: { lat: 35.8460, lng: 128.5972 },
    buk_dg: { lat: 35.8858, lng: 128.5828 },
    suseong: { lat: 35.8581, lng: 128.6306 },
    dalseo: { lat: 35.8299, lng: 128.5327 },
    dalseong: { lat: 35.7744, lng: 128.4311 },
  },
  gwangju: {
    dong_gj: { lat: 35.1461, lng: 126.9227 },
    seo_gj: { lat: 35.1520, lng: 126.8895 },
    nam_gj: { lat: 35.1328, lng: 126.9025 },
    buk_gj: { lat: 35.1741, lng: 126.9122 },
    gwangsan: { lat: 35.1396, lng: 126.7936 },
  },
  ulsan: {
    jung_us: { lat: 35.5681, lng: 129.3320 },
    nam_us: { lat: 35.5444, lng: 129.3311 },
    dong_us: { lat: 35.5050, lng: 129.4161 },
    buk_us: { lat: 35.5828, lng: 129.3611 },
    ulju: { lat: 35.5231, lng: 129.0994 },
  },
  busan: {
    jung_bs: { lat: 35.1064, lng: 129.0324 },
    seo_bs: { lat: 35.0978, lng: 129.0241 },
    dong_bs: { lat: 35.1296, lng: 129.0453 },
    yeongdo: { lat: 35.0910, lng: 129.0678 },
    busanjin: { lat: 35.1631, lng: 129.0533 },
    dongnae: { lat: 35.1979, lng: 129.0682 },
    nam_bs: { lat: 35.1368, lng: 129.0850 },
    buk_bs: { lat: 35.1972, lng: 128.9903 },
    haeundae: { lat: 35.1631, lng: 129.1635 },
    saha: { lat: 35.1046, lng: 128.9747 },
    geumjeong: { lat: 35.2431, lng: 129.0922 },
    gangseo_bs: { lat: 35.2120, lng: 128.9808 },
    yeonje: { lat: 35.1761, lng: 129.0800 },
    suyeong: { lat: 35.1458, lng: 129.1128 },
    sasang: { lat: 35.1525, lng: 128.9917 },
    gijang: { lat: 35.2444, lng: 129.2222 },
  },
  sejong: {
    sejong_city: { lat: 36.4800, lng: 127.2890 },
  },
  chungbuk: {
    cheongju: { lat: 36.6424, lng: 127.4890 },
    chungju: { lat: 36.9910, lng: 127.9259 },
    jecheon: { lat: 37.1326, lng: 128.1910 },
    boeun: { lat: 36.4897, lng: 127.7292 },
    okcheon: { lat: 36.3061, lng: 127.5711 },
    yeongdong: { lat: 36.1750, lng: 127.7836 },
    jincheon: { lat: 36.8553, lng: 127.4356 },
    goesan: { lat: 36.8147, lng: 127.7867 },
    eumseong: { lat: 36.9397, lng: 127.6903 },
    danyang: { lat: 36.9847, lng: 128.3653 },
    jeungpyeong: { lat: 36.7856, lng: 127.5858 },
  },
  chungnam: {
    cheonan: { lat: 36.8151, lng: 127.1139 },
    gongju: { lat: 36.4467, lng: 127.1192 },
    boryeong: { lat: 36.3333, lng: 126.6128 },
    asan: { lat: 36.7897, lng: 127.0017 },
    seosan: { lat: 36.7850, lng: 126.4503 },
    nonsan: { lat: 36.1869, lng: 127.0986 },
    gyeryong: { lat: 36.2744, lng: 127.2486 },
    dangjin: { lat: 36.8897, lng: 126.6458 },
    geumsan: { lat: 36.1086, lng: 127.4878 },
    buyeo: { lat: 36.2758, lng: 126.9097 },
    seocheon: { lat: 36.0781, lng: 126.6914 },
    cheongyang: { lat: 36.4592, lng: 126.8022 },
    hongseong: { lat: 36.6011, lng: 126.6650 },
    yesan: { lat: 36.6806, lng: 126.8444 },
    taean: { lat: 36.7456, lng: 126.2978 },
  },
  jeonbuk: {
    jeonju: { lat: 35.8242, lng: 127.1480 },
    gunsan: { lat: 35.9676, lng: 126.7369 },
    iksan: { lat: 35.9483, lng: 126.9576 },
    jeongeup: { lat: 35.5699, lng: 126.8558 },
    namwon: { lat: 35.4164, lng: 127.3903 },
    gimje: { lat: 35.8039, lng: 126.8808 },
    wanju: { lat: 35.9022, lng: 127.1600 },
    jinan: { lat: 35.7914, lng: 127.4247 },
    muju: { lat: 35.9222, lng: 127.6606 },
    jangsu: { lat: 35.6472, lng: 127.5214 },
    imsil: { lat: 35.6178, lng: 127.2892 },
    sunchang: { lat: 35.3742, lng: 127.1375 },
    gochang: { lat: 35.4358, lng: 126.7019 },
    buan: { lat: 35.7319, lng: 126.7331 },
  },
  jeonnam: {
    mokpo: { lat: 34.8118, lng: 126.3922 },
    yeosu: { lat: 34.7604, lng: 127.6622 },
    suncheon: { lat: 34.9506, lng: 127.4875 },
    naju: { lat: 35.0156, lng: 126.7108 },
    gwangyang: { lat: 34.9406, lng: 127.6956 },
    damyang: { lat: 35.3211, lng: 126.9881 },
    gokseong: { lat: 35.2819, lng: 127.2917 },
    gurye: { lat: 35.2028, lng: 127.4625 },
    goheung: { lat: 34.6117, lng: 127.2850 },
    boseong: { lat: 34.7711, lng: 127.0797 },
    hwasun: { lat: 35.0644, lng: 126.9867 },
    jangheung: { lat: 34.6817, lng: 126.9069 },
    gangjin: { lat: 34.6419, lng: 126.7672 },
    haenam: { lat: 34.5739, lng: 126.5994 },
    yeongam: { lat: 34.8003, lng: 126.6969 },
    muan: { lat: 34.9903, lng: 126.4817 },
    hampyeong: { lat: 35.0656, lng: 126.5175 },
    yeonggwang: { lat: 35.2772, lng: 126.5119 },
    jangseong: { lat: 35.3017, lng: 126.7847 },
    wando: { lat: 34.3108, lng: 126.7550 },
    jindo: { lat: 34.4869, lng: 126.2639 },
    sinan: { lat: 34.8283, lng: 126.1078 },
  },
  gyeongbuk: {
    pohang: { lat: 36.0190, lng: 129.3435 },
    gyeongju: { lat: 35.8562, lng: 129.2247 },
    gimcheon: { lat: 36.1198, lng: 128.1136 },
    andong: { lat: 36.5684, lng: 128.7296 },
    gumi: { lat: 36.1195, lng: 128.3444 },
    yeongju: { lat: 36.8058, lng: 128.6239 },
    yeongcheon: { lat: 35.9733, lng: 128.9386 },
    sangju: { lat: 36.4108, lng: 128.1589 },
    mungyeong: { lat: 36.5867, lng: 128.1867 },
    gyeongsan: { lat: 35.8253, lng: 128.7369 },
    uiseong: { lat: 36.3528, lng: 128.6972 },
    cheongsong: { lat: 36.4361, lng: 129.0572 },
    yeongyang: { lat: 36.6669, lng: 129.1125 },
    yeongdeok: { lat: 36.4150, lng: 129.3656 },
    cheongdo: { lat: 35.6472, lng: 128.7339 },
    goryeong: { lat: 35.7264, lng: 128.2636 },
    seongju: { lat: 35.9189, lng: 128.2833 },
    chilgok: { lat: 35.9953, lng: 128.4017 },
    yecheon: { lat: 36.6581, lng: 128.4519 },
    bonghwa: { lat: 36.8931, lng: 128.7322 },
    uljin: { lat: 36.9931, lng: 129.4003 },
    ulleung: { lat: 37.4842, lng: 130.9058 },
  },
  gyeongnam: {
    changwon: { lat: 35.2280, lng: 128.6811 },
    jinju: { lat: 35.1798, lng: 128.1076 },
    tongyeong: { lat: 34.8544, lng: 128.4331 },
    sacheon: { lat: 35.0037, lng: 128.0642 },
    gimhae: { lat: 35.2286, lng: 128.8892 },
    miryang: { lat: 35.4914, lng: 128.7486 },
    geoje: { lat: 34.8806, lng: 128.6211 },
    yangsan: { lat: 35.3350, lng: 129.0372 },
    uiryeong: { lat: 35.3222, lng: 128.2569 },
    haman: { lat: 35.2722, lng: 128.4069 },
    changnyeong: { lat: 35.5444, lng: 128.4917 },
    goseong_gn: { lat: 34.9728, lng: 128.3228 },
    namhae: { lat: 34.8375, lng: 127.8925 },
    hadong: { lat: 35.0672, lng: 127.7514 },
    sancheong: { lat: 35.4147, lng: 127.8736 },
    hamyang: { lat: 35.5203, lng: 127.7250 },
    geochang: { lat: 35.6861, lng: 127.9097 },
    hapcheon: { lat: 35.5667, lng: 128.1656 },
  },
  jeju: {
    jeju_city: { lat: 33.4996, lng: 126.5312 },
    seogwipo: { lat: 33.2541, lng: 126.5604 },
  },
}
