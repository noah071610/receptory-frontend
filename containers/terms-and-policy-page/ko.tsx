/* eslint-disable react/no-unescaped-entities */
"use client"

import cs from "classnames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

const KoTerms = () => {
  return (
    <div className={cx("terms")}>
      <h1>이용약관</h1>
      <h2>제 1 조 (목적)</h2>
      <p>
        이 이용약관(이하 '약관')은 Receptori(이하 회사라 합니다.)과 이용 고객(이하 '회원')간에 회사가 제공하는 인터넷
        웹사이트 'Receptori'(www.receptori.com)의 서비스에 대한 가입조건 및 이용에 관한 제반 사항을 규정하는데 그 목적이
        있다.
      </p>
      <h2>제 2 조 (약관의 명시와 개정)</h2>
      <p>
        ① 회사는 약관의 규제 등에 관한 법률, 전자거래기본법, 전자서명법, 정보통신망 이용촉진 등에 관한 법률 등 관련법을
        위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
      </p>
      <p>② 다만, 개정 내용이 "이용자"에게 불리할 경우에는 적용일자 30일 이전부터 적용일자 전일까지 공지합니다.</p>
      <p>
        ③ "이용자"는 변경된 약관에 대해 거부할 권리가 있습니다. "이용자"는 변경된 약관이 공지된 후 15일 이내에
        거부의사를 표명할 수 있습니다. "이용자"가 거부하는 경우 회사는 당해 "이용자"와의 계약을 해지할 수 있습니다. 만약
        "이용자"가 변경된 약관이 공지된 후 15일 이내에 거부의사를 표시하지 않는 경우에는 동의하는 것으로 간주합니다.
      </p>
      <h2>제 3 조 (용어의 정의)</h2>
      <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
      <ul>
        <li>회원: 회사와 서비스 이용에 관한 계약을 체결한 자</li>
        <li>아이디(ID): 회원식별과 회원의 서비스이용을 위하여 회원이 선정하고 회사가 승인하는 문자와 숫자의 조합</li>
        <li>비밀번호: 회원이 통신상의 자신의 비밀을 보호하기 위해 선정한 문자와 숫자의 조합</li>
        <li>전자우편(E-Mail): 인터넷을 통한 우편</li>
        <li>해지: 회사 또는 회원이 서비스 이용 이후 그 이용계약을 종료시키는 의사표시</li>
      </ul>
      <h2>제 2 장 서비스 이용계약</h2>
      <h3>제 4 조 (이용계약의 성립)</h3>
      <p>이용자가 등록절차를 거쳐서 "등록하기" 단추를 누르면 이 약관에 동의하는 것으로 간주됩니다.</p>
      <h3>제 5 조 (이용신청)</h3>
      <p>① 서비스 이용신청자는 서비스를 통하여 회사 소정의 가입신청서를 제출함으로써 이용신청을 할 수 있습니다.</p>
      <p>
        ② 서비스 이용신청자는 반드시 실명으로 이용신청을 하여야 하며, 1개의 주민번호에 대해 1건의 이용신청을 할 수
        있습니다.
      </p>
      <h3>제 6 조 (이용신청의 승낙)</h3>
      <p>① 회사는 제6조에 따른 이용신청에 대하여 특별한 사정이 없는 한 접수순서에 따라서 이용신청을 승낙합니다.</p>
      <p>② 회사가 이용신청을 승낙하는 경우 회원에 대하여 서비스를 통하여 다음 각 호의 사항을 통지합니다.</p>
      <ul>
        <li>아이디(ID)</li>
        <li>회원의 책임, 의무 및 권익보호 등에 관한 사항</li>
      </ul>
      <p>
        ③ 회사는 다음 각 호에 해당하는 경우 이용신청에 대한 승낙을 제한할 수 있고, 그 사유가 해소될 때까지 승낙을 유보할
        수 있습니다.
      </p>
      <ul>
        <li>서비스 관련 설비의 용량이 부족한 경우</li>
        <li>기술상 장애사유가 있는 경우</li>
        <li>기타 회사가 필요하다고 인정되는 경우</li>
      </ul>
      <p>④ 회사는 다음 각 호에 해당하는 사항을 인지하는 경우 동 이용신청을 승낙하지 아니합니다.</p>
      <ul>
        <li>다른 사람의 명의를 사용하여 신청한 경우</li>
        <li>사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우</li>
        <li>기타 회사 소정의 이용신청요건을 충족하지 못하는 경우</li>
      </ul>
      <p>
        ⑤ 제3항 또는 제4항에 의하여 이용신청의 승낙을 유보하거나 승낙하지 아니하는 경우, 회사는 이를 이용신청자에 알려야
        합니다. 다만, 회사의 귀책사유 없이 이용신청자에게 통지할 수 없는 경우는 예외로 합니다.
      </p>
      <h3>제 7 조 (회원의 개인정보보호)</h3>
      <p>
        회사는 관련법령이 정하는 바에 따라서 이용자 등록정보를 포함한 이용자의 개인정보를 보호하기 위하여 노력해야
        합니다. 이용자의 개인정보보호에 관해서는 관련법령 및 회사가 정하는 "개인정보보호정책"에 정한 바에 의합니다. 단,
        회사의 공식사이트이외의 웹에서 링크된 사이트에서는 회사의 개인정보 보호정책이 적용되지 않습니다. 또한 회사는
        이용자의 귀책사유로 인해 노출된 정보에 대해서 일체의 책임을 지지 않습니다.
      </p>
      <h2>제 3 장 서비스 제공 및 이용</h2>
      <h3>제 8 조 (서비스의 내용)</h3>
      <p>① 회사가 제공하는 서비스의 내용은 다음과 같습니다.</p>
      <ul>
        <li>홈페이지 제작</li>
      </ul>
      <p>
        ② 회사는 필요한 경우 서비스의 내용을 추가 또는 변경할 수 있습니다. 이 경우 회사는 추가 또는 변경내용을 회원에게
        통지합니다.
      </p>
      <h3>제 9 조 (서비스의 개시)</h3>
      <p>
        서비스는 회사가 제7조에 따라서 이용신청을 승낙한 때로부터 즉시 개시됩니다. 다만, 회사의 업무상 또는 기술상의
        장애로 인하여 서비스를 즉시 개시하지 못하는 경우 회사는 회원에게 이를 지체 없이 통지합니다.
      </p>
      <h3>제 10 조 (서비스 이용시간)</h3>
      <p>
        ① 서비스는 회사의 업무상 또는 기술상 장애, 기타 특별한 사유가 없는 한 연중무휴, 1일 24시간 이용할 수 있습니다.
        다만 설비의 점검 등 회사가 필요한 경우 또는 설비의 장애, 서비스 이용의 폭주 등 불가항력 사항으로 인하여 서비스
        이용에 지장이 있는 경우 예외적으로 서비스 이용의 전부 또는 일부에 대하여 제한할 수 있습니다.
      </p>
      <p>
        ② 회사는 제공하는 서비스 중 일부에 대한 서비스이용시간을 별도로 정할 수 있으며, 이 경우 그 이용시간을 사전에
        회원에게 공지합니다.
      </p>
      <h3>제 11 조 (정보의 제공 및 광고의 게재)</h3>
      <p>① 회사는 서비스를 운용함에 있어서 각종 정보를 서비스에 게재하는 방법 등으로 회원에게 제공할 수 있습니다.</p>
      <p>
        ② 회사는 서비스의 운용과 관련하여 서비스 화면, 홈페이지 등에 광고 등을 게재할 수 있으며 회원들의 전자우편 주소로
        광고메일을 보낼 수 있습니다.
      </p>
      <h3>제 12 조 (서비스 제공의 중지)</h3>
      <p>회사는 다음 각 호에 해당하는 경우 서비스의 제공을 중지할 수 있습니다.</p>
      <ul>
        <li>설비의 보수 등을 위하여 부득이한 경우</li>
        <li>전기통신사업법에 규정된 기간통신사업자가 전기통신서비스를 중지하는 경우</li>
        <li>기타 회사가 서비스를 제공할 수 없는 사유가 발생한 경우.</li>
      </ul>
      <h2>제 4 장 서비스와 관련한 권리·의무관계</h2>
      <h3>제 13 조 (회사의 의무)</h3>
      <p>
        ① 회사는 제12조 및 제14조에서 정한 경우를 제외하고 이 약관에서 정한 바에 따라 계속적, 안정적으로 서비스를 제공할
        수 있도록 최선의 노력을 다하여야 합니다.
      </p>
      <p>
        ② 회사는 서비스에 관련된 설비를 항상 운용할 수 있는 상태로 유지·보수하고, 장애가 발생하는 경우 지체 없이 이를
        수리·복구할 수 있도록 최선의 노력을 다하여야 합니다.
      </p>
      <p>
        ③ 회사는 서비스와 관련한 회원의 불만사항이 접수되는 경우 이를 즉시 처리하여야 하며, 즉시 처리가 곤란한 경우 그
        사유와 처리일정을 서비스 또는 전자우편을 통하여 동 회원에게 통지하여야 합니다.
      </p>
      <h3>제 14 조 (사생활의 보호)</h3>
      <p>
        ① 회원의 개인정보를 본인의 사전 승낙 없이 타인에게 누설, 공개 또는 배포할 수 없습니다. 각 호에 해당하는 경우에는
        공개가 가능합니다.
      </p>
      <ul>
        <li>관계법령에 의하여 수사상의 목적으로 관계기관으로부터 요구 받은 경우</li>
        <li>정보통신윤리위원회의 요청이 있는 경우</li>
        <li>기타 관계법령에 의한 경우</li>
      </ul>
      <p>
        ② 제1항의 범위 내에서, 회사는 광고업무와 관련하여 회원 전체 또는 일부의 개인정보에 관한 통계자료를 작성하여 이를
        사용할 수 있고, 서비스를 통하여 회원의 컴퓨터에 쿠키를 전송할 수 있습니다. 이 경우 회원은 쿠키의 수신을
        거부하거나 쿠키의 수신에 대하여 경고하도록 사용하는 컴퓨터의 브라우저의 설정을 변경할 수 있습니다.
      </p>
      <h3>제 15 조 (회원의 의무)</h3>
      <p>
        ① 회원은 관계법령, 이 약관의 규정, 이용안내 및 주의사항 등 회사가 통지하는 사항을 준수하여야 하며, 기타 회사의
        업무에 방해되는 행위를 하여서는 아니됩니다.
      </p>
      <p>
        ② 회원은 서비스를 이용하여 얻은 정보를 회사의 사전 승낙없이 복사, 복제, 변경, 번역, 출판·방송 기타의 방법으로
        사용하거나 이를 타인에게 제공할 수 없습니다.
      </p>
      <p>
        ③ 회원은 이용신청서의 기재내용 중 변경된 내용이 있는 경우 서비스를 통하여 그 내용을 회사에 통지하여야 합니다.
      </p>
      <p>④ 회원은 서비스 이용과 관련하여 다음 각 호의 행위를 하여서는 아니됩니다.</p>
      <ul>
        <li>다른 회원의 아이디(ID)를 부정사용하는 행위</li>
        <li>범죄행위를 목적으로 하거나 기타 범죄행위와 관련된 행위</li>
        <li>선량한 풍속, 기타 사회질서를 해하는 행위</li>
        <li>타인의 명예를 훼손하거나 모욕하는 행위</li>
        <li>타인의 지적재산권 등의 권리를 침해하는 행위</li>
        <li>해킹행위 또는 컴퓨터바이러스의 유포행위</li>
        <li>타인의 의사에 반하여 광고성 정보 등 일정한 내용을 지속적으로 전송하는 행위</li>
        <li>서비스의 안전적인 운영에 지장을 주거나 줄 우려가 있는 일체의 행위</li>
        <li>기타 관계법령에 위배되는 행위</li>
      </ul>
      <h3>제 16 조 (게시물 또는 내용물의 삭제)</h3>
      <p>
        회사는 서비스의 게시물 또는 내용물이 제17조의 규정에 위반되거나 회사 소정의 게시기간을 초과하는 경우 사전 통지나
        동의없이 이를 삭제할 수 있습니다.
      </p>
      <h3>제 17 조 (게시물에 대한 권리 의무)</h3>
      <p>게시물에 대한 저작권을 포함한 모든 권리 및 책임은 이를 게시한 회원에게 있습니다.</p>
      <h2>제 5 장 기 타</h2>
      <h3>제 18 조 (양도금지)</h3>
      <p>
        회원이 서비스의 이용권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수
        없습니다.
      </p>
      <h3>제 19 조 (계약해지 및 이용제한)</h3>
      <p>
        ① 회사는 회원이 제17조 기타 이 약관의 내용을 위반하고, 회사 소정의 기간 이내에 이를 해소하지 아니하는 경우
        서비스 이용계약을 해지할 수 있습니다.
      </p>
      <p>② 회사는 제1항에 의해 해지된 회원이 다시 이용신청을 하는 경우 일정기간 그 승낙을 제한할 수 있습니다.</p>
      <h3>제 20 조 (면책·배상)</h3>
      <p>
        ① 회사는 회원이 서비스에 게재한 정보, 자료, 사실의 정확성, 신뢰성 등 그 내용에 관하여는 어떠한 책임을 부담하지
        아니하고, 회원은 자기의 책임아래 서비스를 이용하며, 서비스를 이용하여 게시 또는 전송한 자료 등에 관하여 손해가
        발생하거나 자료의 취사선택, 기타 서비스 이용과 관련하여 어떠한 불이익이 발생하더라도 이에 대한 모든 책임은
        회원에게 있습니다.
      </p>
      <p>
        ② 회사는 제17조의 규정에 위반하여 회원간 또는 회원과 제3자간에 서비스를 매개로 하여 물품거래 등과 관련하여
        어떠한 책임도 부담하지 아니하고, 회원이 서비스의 이용과 관련하여 기대하는 이익에 관하여 책임을 부담하지
        않습니다.
      </p>
      <p>
        ③ 회원 아이디(ID)와 비밀번호의 관리 및 이용상의 부주의로 인하여 발생되는 손해 또는 제3자에 의한 부정사용 등에
        대한 책임은 모두 회원에게 있습니다.
      </p>
      <p>
        ④ 회원이 제17조, 기타 이 약관의 규정을 위반함으로 인하여 회사가 회원 또는 제3자에 대하여 책임을 부담하게 되고,
        이로써 회사에게 손해가 발생하게 되는 경우, 이 약관을 위반한 회원은 회사에게 발생하는 모든 손해를 배상하여야
        하며, 동 손해로부터 회사를 면책시켜야 합니다.
      </p>
      <h3>제 21 조 (분쟁의 해결)</h3>
      <p>① 회사와 회원은 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</p>
      <p>
        ② 제1항의 규정에도 불구하고, 동 분쟁으로 인하여 소송이 제기될 경우 동 소송은 회사의 본사소재지를 관할하는 법원의
        관할로 합니다.
      </p>
    </div>
  )
}

export default KoTerms
