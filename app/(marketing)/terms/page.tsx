import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이용약관 - WithTheLake',
  description: '위드더레이크 서비스 이용약관입니다.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">이용약관</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2026년 1월 28일</p>

        <div className="prose prose-gray max-w-none text-[15px] leading-relaxed space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-3">제1조 (목적)</h2>
            <p className="text-gray-700">
              본 이용약관은 주식회사 위드더레이크(이하 &quot;회사&quot;)가 운영하는 위드더레이크 웹사이트 및 힐링로드ON 서비스(이하 &quot;서비스&quot;)의 이용조건과 운영에 관한 제반 사항의 규정을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제2조 (용어의 정의)</h2>
            <p className="text-gray-700">본 약관에서 사용되는 주요 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1 mt-2">
              <li>&quot;회원&quot;이란 회사의 약관에 동의하고 카카오 계정을 통해 회원등록을 한 자로서, 회사와의 이용계약을 체결하고 서비스를 이용하는 이용자를 말합니다.</li>
              <li>&quot;이용계약&quot;이란 서비스 이용과 관련하여 회사와 회원 간에 체결하는 계약을 말합니다.</li>
              <li>&quot;콘텐츠&quot;란 회사가 제공하는 오디오 가이드, 걷기 코스 안내, 감정 기록 기능, 커뮤니티 게시판 등 서비스 내 모든 정보를 말합니다.</li>
              <li>&quot;게시물&quot;이란 회원이 서비스 내 커뮤니티 게시판에 게시한 글, 댓글, 이미지 등을 말합니다.</li>
              <li>&quot;운영자&quot;란 서비스의 전반적인 관리와 운영을 담당하는 자를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제3조 (약관 외 준칙)</h2>
            <p className="text-gray-700">
              회사는 필요한 경우 별도로 운영정책을 공지할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제4조 (이용계약 체결)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>이용계약은 회원으로 등록하여 서비스를 이용하려는 자의 본 약관 내용에 대한 동의와 가입신청에 대하여 회사의 이용승낙으로 성립합니다.</li>
              <li>회원으로 등록하여 서비스를 이용하려는 자는 카카오 계정 연동 시 본 약관을 읽고 동의하는 것으로 본 약관에 대한 동의 의사를 표시합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제5조 (서비스 이용 신청)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회원으로 등록하여 서비스를 이용하려는 이용자는 카카오 계정을 통해 간편 가입할 수 있으며, 이 과정에서 카카오 닉네임, 이메일 등의 정보가 제공됩니다.</li>
              <li>타인의 정보를 도용하거나 허위의 정보를 등록하는 등 본인의 진정한 정보를 등록하지 않은 회원은 서비스 이용과 관련하여 아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌받을 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제6조 (개인정보처리방침)</h2>
            <p className="text-gray-700">
              회사는 관계 법령이 정하는 바에 따라 회원등록정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다.
              회원의 개인정보보호에 관하여 관계법령 및 회사가 정하는{' '}
              <Link href="/privacy" className="text-blue-600 underline">개인정보처리방침</Link>에 정한 바에 따릅니다.
              단, 회원의 귀책 사유로 인해 노출된 정보에 대해 회사는 일체의 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제7조 (회사의 의무)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회사는 이용회원으로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 가급적 빨리 처리하여야 합니다.</li>
              <li>회사는 계속적이고 안정적인 서비스 제공을 위하여 설비에 장애가 생기거나 유실된 때에는 이를 지체 없이 수리 또는 복구할 수 있도록 노력합니다. 다만, 천재지변 또는 회사에 부득이한 사유가 있는 경우 서비스 운영을 일시 정지할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제8조 (회원의 의무)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회원은 본 약관에서 규정하는 사항과 회사가 정한 제반 규정, 공지사항 및 운영정책 등을 준수하여야 하며, 기타 회사의 업무에 방해가 되는 행위, 회사의 명예를 손상하는 행위를 해서는 안 됩니다.</li>
              <li>회원은 서비스의 이용 권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.</li>
              <li>회원은 회사 및 제3자의 지적 재산권을 침해해서는 안 됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제9조 (서비스 이용 시간)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>서비스 이용 시간은 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다. 단, 시스템 정기점검, 증설 및 교체를 위해 서비스를 일시 중단할 수 있으며, 예정된 작업으로 인한 서비스 일시 중단은 사이트에 사전 공지합니다.</li>
              <li>회사는 긴급한 시스템 점검, 국가비상사태, 정전, 천재지변 등의 불가항력적인 사유가 있는 경우 사전 공지 없이 서비스를 일시적 혹은 영구적으로 중단할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제10조 (서비스 이용 해지)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회원이 이용계약을 해지하고자 하는 경우에는 회원 본인이 마이페이지 또는 고객센터를 통하여 해지 신청을 하여야 합니다.</li>
              <li>해지 시 회원의 개인정보 및 게시물은 개인정보처리방침에 따라 처리됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제11조 (서비스 이용 제한)</h2>
            <p className="text-gray-700 mb-2">
              회원은 다음 각 호에 해당하는 행위를 하여서는 아니 되며, 해당 행위를 한 경우에 회사는 회원의 서비스 이용 제한 및 적법한 조치를 할 수 있으며 이용계약을 해지하거나 기간을 정하여 서비스를 중지할 수 있습니다.
            </p>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회원 가입 시 혹은 가입 후 정보 변경 시 허위 내용을 등록하는 행위</li>
              <li>타인의 서비스 이용을 방해하거나 정보를 도용하는 행위</li>
              <li>회사의 운영진, 직원 또는 관계자를 사칭하는 행위</li>
              <li>회사, 기타 제3자의 인격권 또는 지적재산권을 침해하거나 업무를 방해하는 행위</li>
              <li>다른 회원에 대한 개인정보를 그 동의 없이 수집, 저장, 공개하는 행위</li>
              <li>범죄와 결부된다고 객관적으로 판단되는 행위</li>
              <li>기타 관련 법령에 위배되는 행위</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제12조 (게시물의 관리)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>서비스의 게시물과 자료의 관리 및 운영의 책임은 회사에 있습니다. 회사는 불량 게시물 및 자료에 대하여 모니터링을 하여야 하며, 불량 게시물을 발견하거나 신고를 받으면 해당 게시물을 삭제하고 등록한 회원에게 주의를 줄 수 있습니다.</li>
              <li>정보통신윤리위원회 등 공공기관의 시정요구가 있는 경우 회사는 회원의 사전동의 없이 게시물을 삭제하거나 이동할 수 있습니다.</li>
              <li>불량게시물의 판단기준: 다른 회원 또는 제3자에게 심한 모욕을 주거나 명예를 손상하는 내용, 공공질서 및 미풍양속에 위반되는 내용, 불법 복제 또는 해킹을 조장하는 내용, 영리를 목적으로 하는 광고, 범죄와 결부된다고 객관적으로 인정되는 내용, 기타 관계 법령에 위배된다고 판단되는 경우</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제13조 (게시물에 대한 저작권)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회원이 서비스 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다. 회사는 게시자의 동의 없이 게시물을 상업적으로 이용할 수 없습니다. 다만 비영리 목적인 경우는 그러하지 아니하며, 서비스 내의 게재권을 갖습니다.</li>
              <li>회원은 서비스를 이용하여 취득한 정보를 임의 가공, 판매하는 행위 등 서비스에 게재된 자료를 상업적으로 사용할 수 없습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제14조 (손해배상)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>본 서비스에서 발생한 모든 민·형법상 책임은 회원 본인에게 1차적으로 있습니다.</li>
              <li>본 서비스로부터 회원이 받은 손해가 천재지변 등 불가항력적이거나 회원의 고의 또는 과실로 인하여 발생한 때에는 손해배상을 하지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">제15조 (면책)</h2>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
              <li>회사는 회원이 서비스로부터 기대되는 이익을 얻지 못하였거나 서비스 자료에 대한 취사선택 또는 이용으로 발생하는 손해 등에 대해서는 책임이 면제됩니다.</li>
              <li>회사는 회원이 저장, 게시 또는 전송한 자료와 관련하여 일체의 책임을 지지 않습니다.</li>
              <li>회사는 회원 상호 간 또는 회원과 제3자 상호 간에 서비스를 매개로 하여 발생한 분쟁에 대하여 책임지지 아니합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">부칙</h2>
            <p className="text-gray-700">이 약관은 2026년 1월 28일부터 시행합니다.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
