import { ArtStyle } from './types';

export const MODEL_OPTIONS = [
  { 
    id: 'gemini-2.5-flash-image', 
    name: 'Nano Banana', 
    description: '빠른 속도, 일반 화질 (Standard)', 
    badge: 'FAST' 
  },
  { 
    id: 'gemini-3-pro-image-preview', 
    name: 'Nano Banana Pro', 
    description: '최상급 디테일, 우수한 텍스트 (Premium)', 
    badge: 'PRO' 
  }
];

export const MUSIC_GENRES = [
  'K-Pop', 'Pop', 'Hip Hop', 'R&B', 'Ballad',
  'Rock', 'Electronic', 'Jazz', 'City Pop', 'Indie',
  'Metal', 'Lo-Fi', 'Synthwave', 'Disco', 'Classical',
  'Gugak Fusion'
];

export const ASPECT_RATIO_OPTIONS = [
  { value: '1:1', label: 'Square (1:1)', icon: 'Square' },
  { value: '3:4', label: 'Portrait (3:4)', icon: 'RectangleVertical' },
  { value: '4:3', label: 'Landscape (4:3)', icon: 'RectangleHorizontal' },
  { value: '9:16', label: 'Full Story (9:16)', icon: 'Smartphone' },
  { value: '16:9', label: 'Wide (16:9)', icon: 'Monitor' }
];

// Changed structure to support optgroups
export const CHARACTER_SAMPLES = [
  {
    category: "Solo Female (솔로 여가수)",
    items: [
      'Visual Center Idol (청량한 센터 비주얼)',
      'Charismatic Girl Crush Rapper (걸크러쉬 래퍼)',
      'Dreamy Fairy Concept (몽환적인 요정)',
      'High Teen School Look (하이틴 스쿨룩)',
      'Elegant Vocal Queen (우아한 보컬 퀸)',
      'Retro City Pop Lady (레트로 시티팝 여신)',
      'Dark Gothic Witch (다크 고딕 마녀)',
      'Sporty Energy Girl (스포티하고 활기찬 소녀)',
      'R&B Soul Diva (소울풀한 R&B 디바)',
      'Cyber Y2K Millennial (사이버 Y2K 밀레니얼)'
    ]
  },
  {
    category: "Solo Male (솔로 남가수)",
    items: [
      'Refreshing Summer Boy (청량한 여름 소년)',
      'Dark Sexy Vampire (다크 섹시 컨셉)',
      'Emotional Ballad Prince (감성 발라드 왕자)',
      'Hip Hop Street Swag (힙합 스트릿)',
      'Rebellious Rock Star (반항적인 락스타)',
      'Classic Suit Gentleman (클래식 수트 신사)',
      'Casual Boyfriend Look (훈훈한 남친룩)',
      'Traditional Hanbok Prince (현대적 한복 왕자)',
      'Grunge Rocker with Guitar (기타를 멘 그런지 로커)',
      'Future Android Idol (미래형 안드로이드 아이돌)'
    ]
  },
  {
    category: "Fusion / Tradition (국악+힙합 퓨전)",
    items: [
      'Hanbok Streetwear Rapper (한복과 스트릿웨어 믹스 래퍼)',
      'Gat (Hat) & Sunglasses Swag (갓을 쓴 힙합 선비)',
      'B-Boy in Gyeongbokgung (고궁의 비보이)',
      'Cyberpunk Gayageum Player (사이버펑크 가야금 연주자)',
      'Goblin (Dokkaebi) Mask Dancer (도깨비 탈 댄서)',
      'Neon Fan Dancer (네온 부채춤 퍼포먼스)',
      'King in Hoodie (후드티 입은 조선의 왕)',
      'Tiger Hunter Sniper (호랑이 사냥꾼 저격수)',
      'Scholar with Boombox (붐박스를 든 선비)',
      'Namsan Tower Cyber Ninja (남산타워 사이버 닌자)'
    ]
  },
  {
    category: "Group / Unit (그룹/유닛)",
    items: [
      'Girl Group Silhouette (걸그룹 실루엣)',
      'Boy Group Dance Formation (보이그룹 군무 대형)',
      'Mixed Gender Duo (혼성 듀오 케미)',
      'Band Session (밴드 연주)',
      'Hip Hop Crew (힙합 크루)',
      'Dreamy 3-Member Unit (몽환적인 3인조 유닛)',
      'Orchestra & Choir (오케스트라와 합창단)',
      'Retro 60s Girl Group (60년대 레트로 걸그룹)',
      'Futuristic Boy Band (미래지향적 보이그룹)',
      'Acapella Group (아카펠라 그룹)'
    ]
  },
  {
    category: "Concept / Special (컨셉/기타)",
    items: [
      'Virtual AI Avatar (버추얼 AI 아바타)',
      'Cyberpunk Techwear Warrior (사이버펑크 테크웨어)',
      'Retro Y2K Star (Y2K 레트로 스타)',
      'Mysterious Agent in Suit (신비로운 수트 요원)',
      'Luxury Chaebol Look (럭셔리 재벌 3세 룩)',
      'Space Astronaut (우주비행사 컨셉)',
      'Steampunk Inventor (스팀펑크 발명가)',
      'High Fantasy Elf (판타지 엘프)',
      'Horror Survivor (호러 영화 생존자)',
      'Pixel Art Character (픽셀 아트 캐릭터)'
    ]
  }
];

export const VISUAL_CHEAT_KEYS = [
  {
    category: '1. 인물 구성 (Character Composition)',
    items: [
      'Solo Female Portrait (여성 솔로 인물화)',
      'Solo Male Portrait (남성 솔로 인물화)',
      'Solo Female Full Body (여성 솔로 전신)',
      'Solo Male Full Body (남성 솔로 전신)',
      'Girl Group 4-Member Formation (4인조 걸그룹)',
      'Boy Group 5-Member Formation (5인조 보이그룹)',
      'Mixed Gender Duo (혼성 듀오 케미)',
      'Female Duo Besties (여성 듀오 베프 컨셉)',
      'Male Duo Bro-mance (남성 듀오 브로맨스)',
      'Trio Unit Composition (3인조 유닛 구성)',
      'Large Group Dance Formation (다인원 군무 대형)',
      'Center Focus with Backdancers (백댄서와 센터)',
      'Face Only Extreme Close-up (얼굴 초근접)',
      'Upper Body Bust Shot (상반신 바스트 샷)',
      'Back View Silhouette (뒷모습 실루엣)',
      'Side Profile Shot (옆모습 프로필)',
      'Crowd Concert Scene (콘서트 관중 씬)',
      'Romantic Couple Pose (로맨틱 커플 포즈)',
      'Rock Band Session Setup (밴드 세션 구성)',
      'Orchestra & Choir Setup (오케스트라와 합창단)'
    ]
  },
  {
    category: '2. 포즈 & 액션 (Pose & Action)',
    items: [
      'Looking back over shoulder (어깨 너머로 돌아보기)',
      'Dynamic jumping in mid-air (공중 점프)',
      'Reaching hand towards camera (카메라를 향해 손 뻗기)',
      'Floating in zero gravity (무중력 부유)',
      'Covering one eye with hand (한쪽 눈 가리기)',
      'Holding a glowing orb (빛나는 구체 들기)',
      'Sitting on a throne (왕좌에 앉기)',
      'Running towards the light (빛을 향해 달리기)',
      'Playing electric guitar fiercely (강렬한 기타 연주)',
      'Whispering a secret (비밀 속삭이기)',
      'Walking in the rain with umbrella (빗속 우산 산책)',
      'Lying down on flower field (꽃밭에 눕기)',
      'Hair flip motion (머리카락 흩날리기)',
      'Finger heart gesture (손가락 하트)',
      'Praying hands gesture (기도하는 손)',
      'Screaming with megaphone (확성기로 소리치기)',
      'Saluting pose (경례 포즈)',
      'Touching the mirror surface (거울 표면 만지기)',
      'Dancing breakdance freeze (비보잉 프리즈)',
      'Falling from the sky (하늘에서 추락)'
    ]
  },
  {
    category: '3. 의상 & 패션 (Costume)',
    items: [
      'Techwear with straps and buckles (테크웨어 & 버클)',
      'Modern Hanbok fusion (현대적 개량 한복)',
      'Y2K denim on denim (Y2K 청청 패션)',
      'High-end luxury suit & jewelry (럭셔리 수트 & 쥬얼리)',
      'Cyberpunk neon glowing outfit (발광하는 사이버펑크 의상)',
      'Vintage school uniform (빈티지 교복)',
      'Gothic lace dress (고딕 레이스 드레스)',
      'Streetwear hoodie & cap (스트릿 후드 & 캡)',
      'Astronaut space suit (우주복)',
      'Transparent raincoat (투명 우비)',
      'Holographic fabric jacket (홀로그램 자켓)',
      'Steampunk aviator goggles (스팀펑크 고글)',
      'Oversized knit sweater (오버핏 니트)',
      'Military uniform aesthetic (밀리터리 룩)',
      'Biker leather jacket (바이커 가죽 자켓)',
      'Bohemian floral dress (보헤미안 꽃무늬)',
      'Sporty jersey & track pants (스포티 져지)',
      'Traditional Kimono fusion (퓨전 기모노 스타일)',
      'Cybernetic armor parts (사이버네틱 아머)',
      'Masked face (face chain/mask) (마스크/페이스 체인)'
    ]
  },
  {
    category: '4. 카메라 샷 & 구도 (Camera Shot & Angle)',
    items: [
      'Low Angle Shot (로우 앵글/위엄있는 시선)',
      'High Angle Shot (하이 앵글/위에서 내려다보는)',
      'Dutch Angle (더치 앵글/기울어진 긴장감)',
      'Wide Angle Panoramic (와이드 앵글 파노라마)',
      'Fish-eye Effect (피쉬아이 왜곡 효과)',
      'Symmetrical Composition (완벽한 대칭 구도)',
      'Rule of Thirds Framing (3분할 안정적 구도)',
      'Center Focused Composition (중앙 집중 구도)',
      'Over-the-shoulder Shot (어깨 너머 시선)',
      'Bird\'s Eye View (버즈 아이 뷰/수직 부감)',
      'Worm\'s Eye View (웜 아이 뷰/바닥 시점)',
      'Depth of Field Bokeh (아웃포커싱/감성 보케)',
      'Motion Blur Background (배경 모션 블러/속도감)',
      'Selfie Camera Angle (셀카/얼짱 각도)',
      'CCTV Security Cam View (CCTV/보안카메라 시점)',
      'Drone Aerial View (드론 항공 촬영)',
      'Reflection in Mirror (거울/유리 반영 구도)',
      'Through the Keyhole (열쇠 구멍/틈새 시점)',
      'Split Screen Effect (화면 분할 효과)',
      'Isometric View (아이소메트릭/쿼터뷰)'
    ]
  },
  {
    category: '5. 배경 & 장소 (Background)',
    items: [
      'Rainy neon cyberpunk city (비 내리는 네온 도시)',
      'Infinite white void (무한한 하얀 공간)',
      'Sunset at the beach horizon (해변의 노을)',
      'Abandoned industrial warehouse (버려진 폐공장)',
      'Galaxy and stars in space (우주와 은하수)',
      'Blooming flower garden (만개한 꽃밭)',
      'Underwater with light rays (물속과 빛내림)',
      'Retro 90s arcade room (90년대 오락실)',
      'Exploding stage fireworks (터지는 무대 불꽃)',
      'Misty mysterious forest (안개 낀 신비로운 숲)',
      'Rooftop at dawn (새벽의 옥상)',
      'Luxury penthouse interior (럭셔리 펜트하우스)',
      'Graffiti tunnel (그래피티 터널)',
      'Convenience store at night (밤의 편의점)',
      'Desert dunes (사막의 모래언덕)',
      'Arctic glacier landscape (북극 빙하)',
      'Retro American diner (레트로 다이너)',
      'Concert stage with laser lights (콘서트 무대와 레이저)',
      'Green screen studio meta (크로마키 스튜디오)',
      'Broken glass dimension (깨진 유리 차원)'
    ]
  },
  {
    category: '6. 감독 & 화풍 스타일 (Director & Style)',
    items: [
      'Wong Kar-wai style, red tint (왕가위 스타일/홍콩 느와르)',
      'Wes Anderson style, pastel symmetry (웨스 앤더슨/대칭과 파스텔)',
      'Makoto Shinkai style, clouds (신카이 마코토/구름과 빛)',
      'Blade Runner style, rain neon (블레이드 러너/사이버펑크)',
      'Tim Burton style, gothic dark (팀 버튼/고딕 판타지)',
      'Studio Ghibli style, lush nature (지브리/풍성한 자연)',
      'Vaporwave aesthetic, glitch (베이퍼웨이브)',
      'Film Noir, black and white (필름 느와르)',
      'Cyberpunk 2077 aesthetic (사이버펑크 2077)',
      'Renaissance oil painting (르네상스 유화)',
      'Surrealism Salvador Dali (초현실주의)',
      'Pop Art Andy Warhol (팝아트)',
      'Impressionism Van Gogh (인상파/반 고흐)',
      'Ukiyo-e traditional style (우키요에 스타일)',
      'Minimalism flat design (미니멀리즘)',
      'Brutalism architecture (브루탈리즘)',
      'Dreamcore/Weirdcore (드림코어)',
      'Steampunk brass & gears (스팀펑크)',
      'Synthwave retro 80s grid (신스웨이브)',
      'Grunge 90s rock aesthetic (90년대 그런지)'
    ]
  },
  {
    category: '7. 카툰 & 그래픽노블 (Cartoon & Art)',
    items: [
      'Korean Webtoon style (한국 웹툰 스타일)',
      'Marvel Comics style, bold ink (마블 코믹스/미국 만화)',
      'Japanese Anime 90s cell shading (90년대 셀화 애니메이션)',
      'Modern High-Quality Anime (최신 고화질 애니메이션)',
      'Vector art, flat design (벡터 아트/플랫)',
      'Pop Art, halftone dots (팝아트/하프톤)',
      'Oil painting texture (유화 질감)',
      'Watercolour painting (수채화 번짐)',
      '3D Pixar style render (픽사 스타일 3D)',
      'Claymation stop motion (클레이 애니메이션)',
      'Paper cutout craft (종이 공예 스타일)',
      'Pixel Art 8-bit (픽셀 아트)',
      'Voxel Art 3D pixel (복셀 아트)',
      'Low Poly 3D (로우 폴리)',
      'Graffiti street art (그래피티 아트)',
      'Stencil art Banksy style (스텐실 아트)',
      'Charcoal sketch (목탄 스케치)',
      'Colored pencil drawing (색연필 드로잉)',
      'Neon line art (네온 라인 아트)',
      'Manga black and white (흑백 만화책)'
    ]
  }
];

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'studio-photo',
    name: '스튜디오 포토',
    description: '선명하고 깨끗한 고화질 프로필 사진',
    promptModifier: 'professional studio photography, 8k resolution, sharp focus, dramatic studio lighting, highly detailed skin texture, masterpiece, canon 5d, bokeh, realistic portrait',
    previewColor: 'from-gray-700 to-gray-900'
  },
  {
    id: 'kpop-idol',
    name: 'K-Pop 아이돌',
    description: '화사하고 몽환적인 뷰티 화보 스타일',
    promptModifier: 'k-pop idol concept photo, bright and vibrant, soft lighting, beauty retouching, dreamy atmosphere, fashion magazine cover style, high quality, korean beauty standard',
    previewColor: 'from-pink-400 to-rose-300'
  },
  {
    id: 'cinematic-movie',
    name: '시네마틱 무비',
    description: '영화의 한 장면 같은 드라마틱한 연출',
    promptModifier: 'cinematic movie still, color graded, dramatic atmosphere, depth of field, anamorphic lens, ray tracing, unreal engine 5 render style, hyperrealistic, emotional lighting',
    previewColor: 'from-blue-900 to-black'
  },
  {
    id: 'analog-film',
    name: '아날로그 필름',
    description: '필름 카메라의 빈티지한 감성과 노이즈',
    promptModifier: 'analog film photography, kodak portra 400, film grain, vintage aesthetic, light leaks, nostalgic vibe, candid shot, natural lighting, polaroid style',
    previewColor: 'from-orange-200 to-yellow-600'
  },
  {
    id: 'cyberpunk-real',
    name: '네온 리얼리즘',
    description: '사이버펑크 도시의 실사 야경 촬영',
    promptModifier: 'realistic cyberpunk photography, neon lights reflecting on skin, rain, night city background, wet streets, techwear fashion, futuristic vibe, blade runner style',
    previewColor: 'from-purple-600 to-blue-600'
  },
  {
    id: 'dark-noir',
    name: '다크 느와르',
    description: '흑백 혹은 어두운 톤의 강렬한 대비',
    promptModifier: 'dark noir photography, high contrast, low key lighting, mysterious, moody, rim lighting, black and white or desaturated, shadow play, vogue homme',
    previewColor: 'from-gray-900 to-black'
  },
  {
    id: 'fantasy-cgi',
    name: '판타지 CGI',
    description: '파이널 판타지 같은 초고화질 CG 실사',
    promptModifier: 'hyperrealistic 3d render, final fantasy cinematics style, ethereal lighting, magical atmosphere, intricate details, glowing effects, 8k wallpaper, game cinematic',
    previewColor: 'from-indigo-500 to-purple-800'
  },
  {
    id: 'fashion-editorial',
    name: '패션 화보',
    description: '명품 잡지 커버 같은 아방가르드함',
    promptModifier: 'high fashion editorial, vogue magazine cover, avant-garde outfit, dynamic pose, artistic makeup, luxury aesthetic, studio lighting, bold colors',
    previewColor: 'from-red-600 to-rose-900'
  },
  {
    id: 'dreamy-pastel',
    name: '몽환적 파스텔',
    description: '부드럽고 따뜻한 감성의 인물 사진',
    promptModifier: 'soft pastel color palette, dreamy atmosphere, ethereal glow, angelic, romantic vibe, soft focus, flowers and clouds, delicate, fairy tale realism',
    previewColor: 'from-blue-200 to-pink-200'
  },
  {
    id: 'street-snap',
    name: '스트릿 스냅',
    description: '자연스러운 길거리 패션과 일상',
    promptModifier: 'street photography, urban candid shot, natural sunlight, trendy streetwear, city background, depth of field, leica look, raw style',
    previewColor: 'from-green-700 to-emerald-900'
  },
  {
    id: 'retro-flash',
    name: '레트로 플래시',
    description: '90년대 힙합, 직광 플래시 감성',
    promptModifier: '90s retro aesthetic, direct camera flash, harsh shadows, film grain, vintage hip hop vibe, party scene, snapshot style, fish eye lens effect',
    previewColor: 'from-yellow-400 to-red-500'
  },
  {
    id: 'silhouette',
    name: '실루엣 아트',
    description: '역광을 이용한 분위기 있는 실루엣',
    promptModifier: 'silhouette photography, backlit, sunset or stage light background, mysterious, atmospheric, rim light, strong contrast, emotional',
    previewColor: 'from-orange-500 to-black'
  }
];