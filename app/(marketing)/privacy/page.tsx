import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 - WithTheLake',
  description: '위드더레이크 개인정보처리방침입니다.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2026년 1월 28일</p>

        <div className="prose prose-gray max-w-none text-[15px] leading-relaxed space-y-8">
          <p className="text-gray-700">
            주식회사 위드더레이크(이하 &quot;회사&quot;)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>

          <section>
            <h2 className="text-lg font-bold mb-3">제1조 (개인정보의 처리목적)</h2>
            <p className="text-gray-700 mb-2">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <div className="space-y-3 text-gray-700">
              <div>
                <p className="font-medium">1. 회원 가입 및 관리</p>
                <p className="pl-4">회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정 이용 방지, 각종 고지·통지, 고충 처리 등을 목적으로 개인정보를 처리합니다.</p>
              </div>
              <div>
                <p className="font-medium">2. 서비스 제공</p>
                <p className="pl-4">힐링로드ON 오디오 가이드, 감정 기록 및 주간 보고서, 커뮤니티 게시판, 콘텐츠 제공, 맞춤서비스 제공 등을 목적으로 개인정보를 처리합니다.</p>
              </div>
              <div>
                <p className="font-medium">3. 고충 처리</p>
                <p className="pl-4">민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리 결과 통보 등의 목적으로 개인정보를 처리합니다.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제2조 (개인정보의 처리 및 보유기간)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</li>
              <li>
                <p>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>회원 가입 및 관리</strong>: 회원 탈퇴 시까지. 다만, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
                  <li><strong>서비스 제공</strong>: 서비스 공급완료 시까지</li>
                  <li><strong>전자상거래 관련 기록</strong>: 「전자상거래 등에서의 소비자 보호에 관한 법률」에 따라 표시·광고에 관한 기록 6개월, 계약 또는 청약철회에 관한 기록 5년, 소비자 불만 또는 분쟁 처리에 관한 기록 3년</li>
                  <li><strong>통신사실확인자료</strong>: 「통신비밀보호법」에 따라 로그 기록 3개월</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제3조 (개인정보의 제3자 제공)</h2>
            <p className="text-gray-700">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 현재 회사는 개인정보를 제3자에게 제공하고 있지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제4조 (개인정보처리의 위탁)</h2>
            <p className="text-gray-700 mb-2">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-medium">수탁자</th>
                    <th className="text-left py-2 font-medium">위탁 업무 내용</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 pr-4">Supabase Inc.</td>
                    <td className="py-2">데이터베이스 호스팅, 사용자 인증, 파일 스토리지</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">카카오</td>
                    <td className="py-2">소셜 로그인(OAuth) 인증 서비스</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Vercel Inc.</td>
                    <td className="py-2">웹사이트 호스팅 및 배포</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 mt-2">
              회사는 위탁계약 체결 시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제5조 (정보주체의 권리와 그 행사 방법)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>정보주체는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
              <li>권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</li>
              <li>정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</li>
              <li>권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제6조 (처리하는 개인정보 항목)</h2>
            <p className="text-gray-700 mb-2">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-medium">구분</th>
                    <th className="text-left py-2 font-medium">수집 항목</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 pr-4 font-medium">회원가입 (카카오 로그인)</td>
                    <td className="py-2">카카오 계정 식별자(ID), 닉네임, 이메일, 프로필 이미지</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">서비스 이용</td>
                    <td className="py-2">감정 기록 데이터, 걷기 활동 기록, 커뮤니티 게시물/댓글, 업로드 이미지</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">자동 수집</td>
                    <td className="py-2">접속 로그, 쿠키, 접속 IP, 서비스 이용 기록</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제7조 (개인정보의 파기)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회사는 개인정보 보유 기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</li>
              <li>정보주체로부터 동의받은 보유 기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</li>
              <li>전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제8조 (개인정보의 안전성 확보조치)</h2>
            <p className="text-gray-700 mb-2">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 하고 있습니다.</p>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li><strong>관리적 조치</strong>: 내부관리계획 수립 및 시행, 정기적 직원 교육</li>
              <li><strong>기술적 조치</strong>: 개인정보처리시스템 등의 접근 권한 관리, 접근통제시스템 설치, 고유 식별정보 등의 암호화, 보안프로그램 설치</li>
              <li><strong>물리적 조치</strong>: 전산실, 자료보관실 등의 접근통제</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제9조 (쿠키의 설치·운영 및 거부)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.</li>
              <li>
                <p>정보주체는 웹 브라우저 옵션 설정을 통해 쿠키 허용, 차단 등의 설정을 할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>크롬(Chrome): 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷 사용기록 삭제</li>
                  <li>엣지(Edge): 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제</li>
                  <li>사파리(Safari): 설정 &gt; 사파리 &gt; 고급 &gt; 모든 쿠키 차단</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제10조 (개인정보 보호책임자)</h2>
            <p className="text-gray-700 mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm space-y-1">
              <p><strong>개인정보 보호책임자</strong></p>
              <p>성명: 정미경</p>
              <p>직책: 대표이사</p>
              <p>이메일: ceo@withthelake.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제11조 (권익침해 구제 방법)</h2>
            <p className="text-gray-700 mb-2">
              정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>개인정보 분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청: (국번없이) 182 (ecrm.police.go.kr)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제12조 (개인정보 처리방침의 시행)</h2>
            <p className="text-gray-700">이 개인정보 처리방침은 2026년 1월 28일부터 시행합니다.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
