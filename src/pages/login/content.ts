import type { USE_LOCALES } from '@/hooks/useI18nSync'

export const tagStyle = {
  h3: 'font-weight: bold; font-size: 18px; line-height: 1.8em; margin: 12px 0;',
  h4: 'font-weight: bold; font-size: 16px; line-height: 1.8em; margin: 12px 0;',
  ul: 'margin: 8px 0; padding-left: 20px; line-height: 1.8em;',
  li: 'line-height: 1.8em;',
  p: 'margin: 8px 0; line-height: 1.8em;',
}

/** 用户服务协议 html 内容 */
export const userAgreementContentCn: string = `<div>
  <div class="group-infos">
    <p>
      本指引是本应用开发者（以下简称“开发者”）为处理你的个人信息而制定。
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">开发者处理的信息</h4>
      <p class="group-infos__hd-privacyText">
        根据法律规定，开发者仅处理实现小程序功能所必要的信息。
      </p>
    </div>
    <ul class="privacy-config__list">
      <li>
        为了快速填写个人用户信息，开发者将在获取你的明示同意后，收集你的微信昵称、头像。
      </li>
      <li>
        为了匹配最近的服务商，开发者将在获取你的明示同意后，收集你的位置信息。
      </li>
      <li>开发者 收集你的地址，用于快速登记收件地址。</li>
      <li>开发者 收集你选中的照片或视频信息，用于上传业务相关的内容。</li>
      <li>
        为了业务中拍摄现场情况，开发者将在获取你的明示同意后，访问你的摄像头。
      </li>
      <li>
        为了快速完成用户注册，开发者将在获取你的明示同意后，收集你的手机号。
      </li>
      <li>开发者 收集你的身份证号码，用于完成身份认证及相关业务。</li>
      <li>
        为了快速登记车辆信息，开发者将在获取你的明示同意后，收集你的车牌号。
      </li>
      <li>开发者 收集你的邮箱，用于发送电子发票信息。</li>
      <li>开发者 获取你选择的位置信息，用于选择登记业务中选择所在未知。</li>
    </ul>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">你的权益</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。
    </p>
    <p class="group-infos_order">
      若你在小程序中注册了账号，你可以通过以下方式与开发者联系，申请注销你在小程序中使用的账号。在受理你的申请后，开发者承诺在十五个工作日内完成核查和处理，并按照法律法规要求处理你的相关信息。
    </p>
    <p>
      <span style="margin-right: 10px">邮箱 : </span>
      <span style="overflow: hidden; word-break: break-all">changqzq@foxmail.com</span>
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">开发者对信息的存储</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">信息的使用规则</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      开发者将会在本指引所明示的用途内使用收集的信息
    </p>
    <p>
      <span class="privacyLabel group-infos_order">如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以</span>
      <span>隐私政策变更声明</span>
      <span class="privacyLabel">方式告知并征得你的明示同意。</span>
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">信息对外提供</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。
    </p>
    <p class="group-infos_order">
      开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">
        你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系；或者向微信进行投诉。
      </h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p>
      <span style="margin-right: 10px">邮箱 : </span>
      <span style="overflow: hidden; word-break: break-all">changqzq@foxmail.com</span>
    </p>
  </div>
  <p style="text-align: right; margin-top: 30px">更新日期：2025-04-20</p>
  <p style="text-align: right; margin-bottom: 20px">生效日期：2025-04-20</p>
</div>`

/** 用户服务协议 html 内容 */
export const userAgreementContentEn: string = `<div>
  <div class="group-infos">
    <p>
      This guide is formulated by the developer of this application (hereinafter referred to as the "Developer") for the processing of your personal information.
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">Information Processed by the Developer</h4>
      <p class="group-infos__hd-privacyText">
        In accordance with applicable laws, the Developer only processes information necessary for the functionality of the Mini Program.
      </p>
    </div>
    <ul class="privacy-config__list">
      <li>
        To quickly fill in your personal information, the Developer will collect your WeChat nickname and avatar after obtaining your explicit consent.
      </li>
      <li>
        To match you with the nearest service provider, the Developer will collect your location information after obtaining your explicit consent.
      </li>
      <li>The Developer collects your address for quick registration of your delivery address.</li>
      <li>The Developer collects your selected photos or video information for uploading business-related content.</li>
      <li>
        To capture on-site conditions for business purposes, the Developer will access your camera after obtaining your explicit consent.
      </li>
      <li>
        To quickly complete user registration, the Developer will collect your mobile phone number after obtaining your explicit consent.
      </li>
      <li>The Developer collects your ID number for identity verification and related business purposes.</li>
      <li>
        To quickly register vehicle information, the Developer will collect your license plate number after obtaining your explicit consent.
      </li>
      <li>The Developer collects your email address for sending electronic invoice information.</li>
      <li>The Developer obtains your selected location information for selecting your location during business registration.</li>
    </ul>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">Your Rights</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      Regarding your personal information, you may contact the Developer through the following means to exercise your legal rights, including the right to access, copy, correct, and delete your information.
    </p>
    <p class="group-infos_order">
      If you have registered an account in the Mini Program, you may contact the Developer through the following means to request the deletion of your account. Upon receiving your request, the Developer undertakes to complete the verification and processing within fifteen business days and handle your relevant information in accordance with applicable laws and regulations.
    </p>
    <p>
      <span style="margin-right: 10px">Email : </span>
      <span style="overflow: hidden; word-break: break-all">business@liangdiang.cc</span>
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">Information Storage by the Developer</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      The Developer undertakes that, unless otherwise provided by laws and regulations, the retention period for your information shall be the shortest time necessary to achieve the processing purpose.
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">Rules for Use of Information</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      The Developer will use the collected information within the purposes expressly stated in this guide.
    </p>
    <p>
      <span class="privacyLabel group-infos_order">If the Developer uses your information beyond the purposes or reasonable scope of this guide, the Developer must, before changing the purpose or scope of use, once again notify you through a</span>
      <span>Privacy Policy Change Notice</span>
      <span class="privacyLabel">and obtain your explicit consent.</span>
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">External Provision of Information</h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p class="group-infos_order">
      The Developer undertakes not to proactively share or transfer your information to any third party. Where such sharing or transfer is truly necessary, the Developer shall directly obtain your separate consent or confirm that the third party has obtained your separate consent.
    </p>
    <p class="group-infos_order">
      The Developer undertakes not to publicly disclose your information. Where public disclosure is necessary, the Developer shall inform you of the purpose of the disclosure, the types of information to be disclosed, and the information that may be involved, and obtain your separate consent.
    </p>
  </div>
  <div class="group-infos">
    <div class="group-infos__hd">
      <h4 class="group-infos__title">
        If you believe the Developer has not complied with the above commitments, or if you have other complaints or suggestions, or questions regarding the protection of minors' personal information, you may contact the Developer through the following means; or file a complaint with WeChat.
      </h4>
      <p class="group-infos__hd-privacyText"></p>
    </div>
    <p>
      <span style="margin-right: 10px">Email : </span>
      <span style="overflow: hidden; word-break: break-all">business@liangdiang.cc</span>
    </p>
  </div>
  <p style="text-align: right; margin-top: 30px">Updated: 2025-04-20</p>
  <p style="text-align: right; margin-bottom: 20px">Effective Date: 2025-04-20</p>
</div>`

export const userAgreementContent: Record<USE_LOCALES, string> = {
  'zh-CN': userAgreementContentCn,
  'en-US': userAgreementContentEn,
}
