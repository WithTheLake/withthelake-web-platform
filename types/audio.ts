// 오디오 카테고리 타입
export type AudioCategory = 'walk_guide' | 'affirmation' | 'trail_guide'

// 오디오 아이템 타입 (Supabase audio_tracks 테이블과 일치)
export interface AudioItem {
  id: string // UUID
  title: string
  description: string | null
  filename: string
  emoji: string | null
  category: AudioCategory
  subcategory?: string | null // 세분류 (예: '자기수용', '성장' 등)
  province?: string | null // 도 (trail_guide용, 예: 'gangwon')
  city?: string | null // 시군구 (trail_guide용, 예: 'chuncheon')
  trail_name?: string | null // 길 이름 (trail_guide용)
  duration?: number | null
  distance?: string | null // 거리 (trail_guide용, 예: '2.5km')
  walking_time?: string | null // 소요시간 (trail_guide용, 예: '약 40분')
  difficulty?: 'easy' | 'moderate' | 'hard' | null // 난이도
  is_active?: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}

// 재생 상태 타입
export type PlaybackState = 'playing' | 'paused' | 'stopped'

// 도 목록 (한글명 매핑)
export const PROVINCE_NAMES: Record<string, string> = {
  seoul: '서울특별시',
  gyeonggi: '경기도',
  incheon: '인천광역시',
  gangwon: '강원특별자치도',
  chungbuk: '충청북도',
  chungnam: '충청남도',
  sejong: '세종특별자치시',
  daejeon: '대전광역시',
  jeonbuk: '전북특별자치도',
  jeonnam: '전라남도',
  gwangju: '광주광역시',
  gyeongbuk: '경상북도',
  gyeongnam: '경상남도',
  daegu: '대구광역시',
  ulsan: '울산광역시',
  busan: '부산광역시',
  jeju: '제주특별자치도',
}

// 시군구 목록 (한글명 매핑)
export const CITY_NAMES: Record<string, string> = {
  // 강원도
  chuncheon: '춘천시',
  wonju: '원주시',
  gangneung: '강릉시',
  sokcho: '속초시',
  donghae: '동해시',
  samcheok: '삼척시',
  taebaek: '태백시',
  hongcheon: '홍천군',
  hoengseong: '횡성군',
  yeongwol: '영월군',
  pyeongchang: '평창군',
  jeongseon: '정선군',
  cheorwon: '철원군',
  hwacheon: '화천군',
  yanggu: '양구군',
  inje: '인제군',
  goseong: '고성군',
  yangyang: '양양군',

  // 경기도
  suwon: '수원시',
  seongnam: '성남시',
  goyang: '고양시',
  yongin: '용인시',
  bucheon: '부천시',
  ansan: '안산시',
  anyang: '안양시',
  namyangju: '남양주시',
  hwaseong: '화성시',
  pyeongtaek: '평택시',
  uijeongbu: '의정부시',
  siheung: '시흥시',
  paju: '파주시',
  gimpo: '김포시',
  gwangmyeong: '광명시',
  gwangju_gg: '광주시',
  gunpo: '군포시',
  hanam: '하남시',
  osan: '오산시',
  icheon: '이천시',
  anseong: '안성시',
  uiwang: '의왕시',
  yangpyeong: '양평군',
  yeoju: '여주시',
  gwacheon: '과천시',
  guri: '구리시',
  pocheon: '포천시',
  dongducheon: '동두천시',
  yangju: '양주시',
  gapyeong: '가평군',
  yeoncheon: '연천군',

  // 충청북도
  cheongju: '청주시',
  chungju: '충주시',
  jecheon: '제천시',
  boeun: '보은군',
  okcheon: '옥천군',
  yeongdong: '영동군',
  jeungpyeong: '증평군',
  jincheon: '진천군',
  goesan: '괴산군',
  eumseong: '음성군',
  danyang: '단양군',

  // 충청남도
  cheonan: '천안시',
  gongju: '공주시',
  boryeong: '보령시',
  asan: '아산시',
  seosan: '서산시',
  nonsan: '논산시',
  gyeryong: '계룡시',
  dangjin: '당진시',
  geumsan: '금산군',
  buyeo: '부여군',
  seocheon: '서천군',
  cheongyang: '청양군',
  hongseong: '홍성군',
  yesan: '예산군',
  taean: '태안군',

  // 전북특별자치도
  jeonju: '전주시',
  gunsan: '군산시',
  iksan: '익산시',
  jeongeup: '정읍시',
  namwon: '남원시',
  gimje: '김제시',
  wanju: '완주군',
  jinan: '진안군',
  muju: '무주군',
  jangsu: '장수군',
  imsil: '임실군',
  sunchang: '순창군',
  gochang: '고창군',
  buan: '부안군',

  // 전라남도
  mokpo: '목포시',
  yeosu: '여수시',
  suncheon: '순천시',
  naju: '나주시',
  gwangyang: '광양시',
  damyang: '담양군',
  gokseong: '곡성군',
  gurye: '구례군',
  goheung: '고흥군',
  boseong: '보성군',
  hwasun: '화순군',
  jangheung: '장흥군',
  gangjin: '강진군',
  haenam: '해남군',
  yeongam: '영암군',
  muan: '무안군',
  hampyeong: '함평군',
  yeonggwang: '영광군',
  jangseong: '장성군',
  wando: '완도군',
  jindo: '진도군',
  sinan: '신안군',

  // 경상북도
  pohang: '포항시',
  gyeongju: '경주시',
  gimcheon: '김천시',
  andong: '안동시',
  gumi: '구미시',
  yeongju: '영주시',
  yeongcheon: '영천시',
  sangju: '상주시',
  mungyeong: '문경시',
  gyeongsan: '경산시',
  uiseong: '의성군',
  cheongsong: '청송군',
  yeongyang: '영양군',
  yeongdeok: '영덕군',
  cheongdo: '청도군',
  goryeong: '고령군',
  seongju: '성주군',
  chilgok: '칠곡군',
  yecheon: '예천군',
  bonghwa: '봉화군',
  uljin: '울진군',
  ulleung: '울릉군',
  gunwi: '군위군',

  // 경상남도
  changwon: '창원시',
  jinju: '진주시',
  tongyeong: '통영시',
  sacheon: '사천시',
  gimhae: '김해시',
  miryang: '밀양시',
  geoje: '거제시',
  yangsan: '양산시',
  uiryeong: '의령군',
  haman: '함안군',
  changnyeong: '창녕군',
  goseong_gn: '고성군',
  namhae: '남해군',
  hadong: '하동군',
  sancheong: '산청군',
  hamyang: '함양군',
  geochang: '거창군',
  hapcheon: '합천군',

  // 제주특별자치도
  jeju_city: '제주시',
  seogwipo: '서귀포시',

  // 서울특별시
  jongno: '종로구',
  jung: '중구',
  yongsan: '용산구',
  seongdong: '성동구',
  gwangjin: '광진구',
  dongdaemun: '동대문구',
  jungnang: '중랑구',
  seongbuk: '성북구',
  gangbuk: '강북구',
  dobong: '도봉구',
  nowon: '노원구',
  eunpyeong: '은평구',
  seodaemun: '서대문구',
  mapo: '마포구',
  yangcheon: '양천구',
  gangseo: '강서구',
  guro: '구로구',
  geumcheon: '금천구',
  yeongdeungpo: '영등포구',
  dongjak: '동작구',
  gwanak: '관악구',
  seocho: '서초구',
  gangnam: '강남구',
  songpa: '송파구',
  gangdong: '강동구',

  // 인천광역시
  jung_ic: '중구',
  dong_ic: '동구',
  michuhol: '미추홀구',
  yeonsu: '연수구',
  namdong: '남동구',
  bupyeong: '부평구',
  gyeyang: '계양구',
  seo_ic: '서구',
  ganghwa: '강화군',
  ongjin: '옹진군',

  // 대전광역시
  dong_dj: '동구',
  jung_dj: '중구',
  seo_dj: '서구',
  yuseong: '유성구',
  daedeok: '대덕구',

  // 대구광역시
  jung_dg: '중구',
  dong_dg: '동구',
  seo_dg: '서구',
  nam_dg: '남구',
  buk_dg: '북구',
  suseong: '수성구',
  dalseo: '달서구',
  dalseong: '달성군',

  // 광주광역시
  dong_gj: '동구',
  seo_gj: '서구',
  nam_gj: '남구',
  buk_gj: '북구',
  gwangsan: '광산구',

  // 울산광역시
  jung_us: '중구',
  nam_us: '남구',
  dong_us: '동구',
  buk_us: '북구',
  ulju: '울주군',

  // 부산광역시
  jung_bs: '중구',
  seo_bs: '서구',
  dong_bs: '동구',
  yeongdo: '영도구',
  busanjin: '부산진구',
  dongnae: '동래구',
  nam_bs: '남구',
  buk_bs: '북구',
  haeundae: '해운대구',
  saha: '사하구',
  geumjeong: '금정구',
  gangseo_bs: '강서구',
  yeonje: '연제구',
  suyeong: '수영구',
  sasang: '사상구',
  gijang: '기장군',

  // 세종특별자치시
  sejong_city: '세종시',
}

// 난이도 라벨
export const DIFFICULTY_LABELS = {
  easy: { label: '쉬움', color: 'text-green-600', bg: 'bg-green-100' },
  moderate: { label: '보통', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  hard: { label: '어려움', color: 'text-red-600', bg: 'bg-red-100' },
}
