import { ThemeConfig } from './types';
export const CAMPAIGN_THEMES: Record<string, ThemeConfig> = {
  lifestyle: {
    id: 'lifestyle',
    name: 'Đời sống & Streetwear',
    description: 'Phong cách tự nhiên, gần gũi, dạo phố. Tuyệt vời cho Tiktok, Reels chốt sale.',
    scenes: [
      {
        id: 'ls_1', label: 'Cầm giày trong công viên', lockType: 'product_only',
        prompt_template: 'Bàn tay nâng đôi giày tham chiếu ở góc 3/4, giày chiếm 60% khung hình, thấy rõ mũi, bên hông và đế. Lối đi công viên và cây xanh mờ phía sau; ánh sáng ban ngày dịu, bóng và tỉ lệ bàn tay chân thực. Giữ chính xác thiết kế, màu và logo theo ảnh sản phẩm; không tạo chữ.',
        video_action_context: '8-second continuous shot. Hand turns the pair slightly to reveal its side profile, then holds it steady. Stable slow push-in; realistic grip and weight, product stays sharp and unchanged. No speech or on-screen text.'
      },
      {
        id: 'ls_2', label: 'Cầm giày với trang phục denim', lockType: 'product_only',
        prompt_template: 'Góc nhìn thứ nhất từ trên xuống: bàn tay cầm đôi giày đúng vị trí cấu tạo thực tế; bên dưới là quần denim và nền gạch phố trung tính. Giày ở tiền cảnh, đủ sáng, đúng tỉ lệ và rủ tự nhiên theo trọng lực. Không thêm dây, quai hoặc phụ kiện không có trên ảnh gốc.',
        video_action_context: '8-second first-person shot. Hand lifts the shoes slightly, then lowers them once with realistic gravity. Camera follows smoothly; shoe details remain consistent. No speech or on-screen text.'
      },
      {
        id: 'ls_3', label: 'Chân mang giày trên bậc thềm', lockType: 'product_and_feet',
        prompt_template: 'Cận cảnh từ đầu gối trở xuống, nhân vật tham chiếu mang đúng đôi giày trên bậc thềm đá. Góc thấp 3/4 ngang tầm giày, hai chiếc đều rõ, chiếm 65% khung hình. Ánh sáng tự nhiên làm nổi chất liệu và form đế, nền vườn mờ, chân tiếp đất hợp lý; không lộ mặt.',
        video_action_context: '8-second low-angle shot. One foot shifts weight and turns outward slightly to reveal side and sole edge. Short stable camera move; both shoes stay grounded and consistent. No speech or on-screen text.'
      },
      {
        id: 'ls_4', label: 'Lookbook bước đi ngoài trời', lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu bước trên lối gạch cạnh công viên, trang phục giữ theo ảnh tham chiếu. Góc 3/4 hơi thấp, giày luôn hiện rõ ở nửa dưới khung, tư thế tự nhiên. Ánh sáng ban ngày mềm, màu sản phẩm trung thực, không để trang phục che giày.',
        video_action_context: '8-second continuous low-angle tracking shot. Character takes two natural steps at a steady pace. Footwear stays visible and identical on both feet; no jump cuts. No speech or on-screen text.'
      },
      {
        id: 'ls_5', label: 'Giày bên cửa sổ ấm áp', lockType: 'product_only',
        prompt_template: 'Đôi giày đặt vững trên vải cotton trắng cạnh cửa sổ rèm sáo; chiếc trước góc 3/4, chiếc sau cho thấy bên hông. Ánh sáng cửa sổ dịu phối đèn ấm vừa phải, bóng tiếp xúc thật. Giày sắc nét, hậu cảnh phòng ở mờ, không thêm hoặc đổi chi tiết sản phẩm.',
        video_action_context: '8-second slow sideways camera slide revealing the second shoe. Gentle window light, shoes stationary and sharply focused. No speech or on-screen text.'
      },
      {
        id: 'ls_6', label: 'Unboxing thấy rõ đôi giày', lockType: 'product_only',
        prompt_template: 'Hộp giấy trung tính đã mở, giấy lót gấp gọn; đôi giày tham chiếu nằm trọn trong hộp và không bị che. Góc chéo từ trên xuống 45 độ, ảnh bán hàng sáng rõ, nền bàn gỗ đơn giản. Không tạo logo giả hoặc thêm phụ kiện ngoài ảnh tham chiếu.',
        video_action_context: '8-second top-down shot. A hand folds back one tissue-paper edge, revealing more of the already visible pair; slow push-in and consistent product. No speech or on-screen text.'
      }
    ]
  },
  studio: {
    id: 'studio',
    name: 'Studio Sang Trọng',
    description: 'Tôn vinh chất liệu sản phẩm, bóng bẩy, nghệ thuật. Phù hợp cho Website, Banner.',
    scenes: [
      {
        id: 'st_1', label: 'Hai góc trên bục sáng', lockType: 'product_only',
        prompt_template: 'Đôi giày trên bục trắng: chiếc trước góc 3/4 cho thấy mũi và bên hông, chiếc sau xoay để thấy gót và đế. Nền kem tối giản, ánh sáng studio khuếch tán, bóng tiếp xúc mềm. Cả đôi cùng thiết kế và màu, sắc nét toàn bộ, không chữ.',
        video_action_context: '8-second short camera arc around the stable pedestal, revealing side and heel. Constant soft lighting, both shoes fixed and identical. No speech or on-screen text.'
      },
      {
        id: 'st_2', label: 'Nền lụa studio cao cấp', lockType: 'product_only',
        prompt_template: 'Đôi giày đặt trên mặt phẳng sáng, vải lụa màu kem chỉ ở hậu cảnh và không che sản phẩm. Góc 3/4 hơi cao cho thấy form và chất liệu, bóng đổ tự nhiên. Chừa vùng trống phía trên để thêm chữ sau khi tạo ảnh; không tạo chữ trong ảnh.',
        video_action_context: '8-second gentle lateral camera slide; only loose background fabric moves slightly. Shoes stay grounded, still and sharp. No speech or on-screen text.'
      },
      {
        id: 'st_3', label: 'Mang giày trên nền đen phản chiếu', lockType: 'product_and_feet',
        prompt_template: 'Khung hình từ đầu gối trở xuống, nhân vật tham chiếu đứng vững with đúng đôi giày trên sàn đen phản chiếu nhẹ. Góc thấp 3/4 làm rõ mũi, bên hông và cạnh đế; đèn viền cùng đèn chính đủ sáng để thấy đúng màu. Không lộ mặt hoặc kéo dài chân, phản chiếu vật lý chính xác.',
        video_action_context: '8-second slow push-in. One foot pivots slightly while the other stays planted; reflection follows accurately. Shoe details remain consistent. No speech or on-screen text.'
      },
      {
        id: 'st_4', label: 'Nước nghệ thuật phía sau sản phẩm', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu đặt vững trên bục tối phản chiếu. Dải chất lỏng nghệ thuật có màu hài hòa chuyển động ở xa trong hậu cảnh, không chạm hoặc che sản phẩm. Góc 3/4 thấp, đèn chính làm rõ logo, bề mặt và form đế; giày giữ đúng thiết kế từ ảnh gốc.',
        video_action_context: '8-second slow camera arc. Decorative liquid moves only in the background; shoes remain fixed and grounded, reflections consistent. No speech or on-screen text.'
      },
      {
        id: 'st_5', label: 'Spotlight trên bục tối', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu đặt trên bục đen mờ: một chiếc góc bên thấy đế và thân, chiếc còn lại góc 3/4 thấy mũi. Quầng sáng ở nền phía sau, đèn chính đủ sáng cho chất liệu và màu sắc, bóng tiếp xúc thật. Không để vùng tối nuốt mất chi tiết.',
        video_action_context: '8-second slow push-in. Background spotlight brightens gently while key light on the still shoes stays constant. No speech or on-screen text.'
      },
      {
        id: 'st_6', label: 'Cận cảnh chi tiết có thật', lockType: 'product_only',
        prompt_template: 'Cận cảnh một chi tiết thực sự thấy được trên ảnh giày tham chiếu: bề mặt, đường may, quai, dây hoặc mép đế nếu có. Bàn tay nhẹ nhàng chạm vào chi tiết nhưng không che giày; tỉ lệ bàn tay hợp lý, ánh sáng mềm, hậu cảnh mờ. Không tự tạo khóa, quai, logo hoặc công năng chưa có.',
        video_action_context: '8-second macro shot. Hand touches one actual visible product detail once and releases; camera stable, focus on that detail. Do not invent moving parts. No speech or on-screen text.'
      }
    ]
  },
  creative: {
    id: 'creative',
    name: 'Sáng tạo & Phá cách',
    description: 'Concept độc lạ, góc máy dị, gây chú ý mạnh (Hook 3s đầu).',
    scenes: [
      {
        id: 'cr_1', label: 'Mô hình giày khổng lồ concept', lockType: 'full_body',
        prompt_template: 'Concept quảng cáo có mô hình trưng bày phóng đại của đôi giày tham chiếu ở trung tâm; nhân vật tham chiếu đứng cạnh và mang phiên bản giày đúng tỉ lệ thực tế. Góc rộng hơi thấp, phông studio pastel sạch. Cả mô hình và giày mang trên chân phải cùng màu, chi tiết, không che sản phẩm.',
        video_action_context: '8-second wide shot. Modest low-angle camera push-in, character shifts stance naturally; giant display stays still, shoes on feet remain consistent. No speech or on-screen text.'
      },
      {
        id: 'cr_2', label: 'Sản phẩm trên khối hình học', lockType: 'product_only',
        prompt_template: 'Đôi giày đặt trên hai bệ hình học trắng cao thấp khác nhau, có điểm tựa rõ ràng. Góc 3/4 thấy toàn bộ form, vải rủ màu kem ở hậu cảnh; khoảng trống bên trái dành cho tiêu đề thêm sau. Ánh sáng mềm, bóng tiếp xúc vật lý chính xác, không tạo chữ.',
        video_action_context: '8-second gentle rising camera move revealing pedestal heights and side profiles; shoes remain fixed and grounded. No speech or on-screen text.'
      },
      {
        id: 'cr_3', label: 'Nền pop-art năng động', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu nằm giữa khung trên mặt phẳng sạch ở góc 3/4. Đường đồ họa lượn sóng và mảng màu tương phản chỉ ở nền, không đè lên sản phẩm. Giày giữ chất ảnh chụp chân thực, đủ sáng, rõ màu và logo; chừa khoảng trống để thêm chữ sau.',
        video_action_context: '8-second fixed camera; background graphic lines animate subtly toward the still photorealistic shoes. No speech or on-screen text.'
      },
      {
        id: 'cr_4', label: 'Neon viền sản phẩm', lockType: 'product_only',
        prompt_template: 'Đôi giày trên bục thấp ở góc 3/4 ngang tầm. Nền gradient tối với đèn neon ở xa; đèn chính trung tính vẫn cho thấy đúng màu, vật liệu và chi tiết. Sản phẩm chiếm 65% khung, có bóng tiếp xúc, không chữ hoặc logo tự tạo.',
        video_action_context: '8-second slow sideways camera move. Neon background shifts gently, neutral product light stays constant; shoes remain grounded. No speech or on-screen text.'
      },
      {
        id: 'cr_5', label: 'Không khí âm nhạc đường phố', lockType: 'product_and_feet',
        prompt_template: 'Khung từ đầu gối trở xuống: nhân vật tham chiếu ngồi trên ghế cạnh loa trang trí, hai chân mang giày tham chiếu đặt trên sàn. Góc thấp 3/4, đôi giày sắc nét, loa ở nền mờ. Ánh sáng màu chỉ hắt vào nền; mặt giày có đèn trung tính để giữ màu chính xác.',
        video_action_context: '8-second stable low-angle shot. Seated character changes foot position once; camera makes a small push-in. Background lights move subtly, shoes remain consistent. No speech or on-screen text.'
      },
      {
        id: 'cr_6', label: 'Giày trẻ em trên lòng bàn tay', lockType: 'product_only',
        prompt_template: 'Chỉ dùng cảnh này nếu sản phẩm tham chiếu thật sự là giày trẻ em. Bàn tay người lớn đỡ một chiếc giày đúng kích thước thực; chiếc còn lại đặt gần đó trên bàn. Góc 3/4 cận cảnh, nền công viên sáng mờ, trọng lượng và tỉ lệ vật lý hợp lý. Không thu nhỏ giày người lớn.',
        video_action_context: '8-second close-up. Hand raises the child-size shoe a few centimeters and holds steady; second shoe stays on the table. Maintain realistic scale and design. No speech or on-screen text.'
      }
    ]
  },
  editorial: {
    id: 'editorial',
    name: 'Tạp chí & Đồ họa',
    description: 'Tối ưu không gian để chèn Text/Tính năng. Phù hợp Ads, Print.',
    scenes: [
      {
        id: 'ed_1', label: 'Nền infographic thương mại', lockType: 'product_only',
        prompt_template: 'Đôi giày ở trung tâm nền pastel sạch, góc 3/4 thấy mũi, thân và đế. Chừa vùng trống phía trên và hai bên để giao diện thêm tiêu đề, giá và lợi ích sau. Studio sáng đều, bóng mềm, chi tiết rõ. Không tạo chữ, icon, chứng nhận hoặc tính năng chưa được cung cấp.',
        video_action_context: '8-second stable product shot with very slow push-in. Leave text-safe areas empty; shoe stays still and sharp. No generated text or speech.'
      },
      {
        id: 'ed_2', label: 'Banner sản phẩm và người mang', lockType: 'full_body',
        prompt_template: 'Bố cục chia đôi: trái là đôi giày tham chiếu góc 3/4 trên nền studio trắng; phải là nhân vật tham chiếu ngồi trên bậc đá mang đúng đôi giày đó. Cả hai nửa cùng màu và chi tiết sản phẩm, giày không bị cắt mũi hoặc đế. Dải trống phía trên dành cho tiêu đề thêm sau; không tạo chữ hoặc giá.',
        video_action_context: '8-second split composition. Left shoes still; right character shifts one foot slightly. Product appearance matches exactly between panels. No speech or on-screen text.'
      },
      {
        id: 'ed_3', label: 'Tạp chí phối đồ và cận giày', lockType: 'full_body',
        prompt_template: 'Bố cục hai khung: trái nhân vật tham chiếu đứng trước gương, mặc trang phục tham chiếu và mang giày nhìn rõ; phải là cận cảnh cùng đôi giày trên nền kem. Ánh sáng mềm, hai khung nhất quán về nhân vật và sản phẩm, chừa vùng trống để thêm chữ sau. Không tự tạo chữ hoặc nhãn hiệu.',
        video_action_context: '8-second two-panel shot. Left character subtly shifts stance; right product remains still with slight push-in. Outfit and shoes consistent across both panels. No speech or on-screen text.'
      },
      {
        id: 'ed_4', label: 'Sofa tập trung vào giày', lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu ngồi tự nhiên trên sofa vải kem, hai chân mang đúng đôi giày tham chiếu ở tiền cảnh. Góc thấp 3/4, giày sắc nét và không bị che. Phòng sáng với tạp chí mờ ở hậu cảnh; ánh sáng cửa sổ mềm, giữ nhận diện, trang phục và giày theo ảnh tham chiếu.',
        video_action_context: '8-second medium shot. Character settles both feet naturally; camera drifts slightly toward the shoes. Consistent anatomy and footwear. No speech or on-screen text.'
      },
      {
        id: 'ed_5', label: 'Flat lay pop-art tươi sáng', lockType: 'product_only',
        prompt_template: 'Góc từ trên xuống 90 độ, đôi giày đặt song song hơi lệch góc trên nền vàng sáng. Các hình tròn trang trí ở xa mép giày, không che mũi, gót, thân hoặc logo. Ánh sáng đều, bóng mềm, vùng trống phía trên để thêm thông điệp bán hàng sau; không tạo chữ.',
        video_action_context: '8-second top-down shot with a very slow zoom-in; background circles move gently without covering the fixed shoes. No speech or on-screen text.'
      },
      {
        id: 'ed_6', label: 'KOC cầm giày giới thiệu', lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu đứng trong phòng sáng đơn giản, hai tay đưa đôi giày tham chiếu ngang ngực hướng về máy. Giày chiếm 45% khung và sắc nét nhất; gương mặt vẫn nhận diện được phía sau, nét dịu hơn. Cầm chắc, không che logo hoặc chi tiết giày, giữ diện mạo và trang phục theo ảnh nhân vật.',
        video_action_context: '8-second single take. Character slowly tilts the shoes once to reveal a side, then holds still. Product stays sharpest, hands and shoes consistent. No speech or on-screen text.'
      }
    ]
  },
  conversion: {
    id: 'conversion', name: 'Cảnh chốt sale & Chi tiết',
    description: 'Sáu góc bổ sung giúp khách nhìn rõ sản phẩm trước khi mua.',
    scenes: [
      { id: 'cv_1', label: 'Toàn bộ đôi giày 3/4', lockType: 'product_only',
        prompt_template: 'Đúng một đôi giày tham chiếu trên nền studio sáng. Chiếc trước góc 3/4, chiếc sau góc bên, nhìn rõ mũi, thân, gót và đế; cả hai cùng màu và thiết kế. Sản phẩm sắc nét, bóng mềm, không cắt mép, không chữ hoặc phụ kiện bịa thêm.',
        video_action_context: '8-second short smooth camera arc from front three-quarter toward side. Both shoes still, fully visible and unchanged. No speech or on-screen text.' },
      { id: 'cv_2', label: 'Góc bên thấy form và đế', lockType: 'product_only',
        prompt_template: 'Một chiếc giày tham chiếu ở góc nghiêng bên 90 độ đặt vững trên bề mặt trung tính, chiếc còn lại mờ nhẹ phía sau. Toàn bộ đường thân, gót và cạnh đế rõ nét, ánh sáng ngang dịu. Giữ đúng chiều cao đế, tỉ lệ, màu, chất liệu và logo.',
        video_action_context: '8-second static side-profile with a small lateral camera slide. Shoe grounded; silhouette and sole edge remain identical. No speech or on-screen text.' },
      { id: 'cv_3', label: 'Cận mũi và chất liệu', lockType: 'product_only',
        prompt_template: 'Ảnh macro phần mũi và chất liệu thật nhìn thấy được của giày tham chiếu. Góc 3/4 từ hơi trên cao; mũi giày sắc nét, phần còn lại mờ nhẹ nhưng vẫn nhận ra cùng mẫu. Ánh sáng mềm, màu thật; không tạo lỗ thoáng, đường may hoặc logo không có trong ảnh gốc.',
        video_action_context: '8-second gentle macro push-in along actual visible toe material; focus shifts to a real source-image detail. No invented features, speech or on-screen text.' },
      { id: 'cv_4', label: 'Gót giày từ phía sau', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu nhìn từ phía sau ở góc ngang tầm gót, đặt cân đối trên nền studio sáng. Form gót, thân và đế phù hợp ảnh tham chiếu; không giả định có logo hoặc phụ kiện ở vị trí không thấy rõ. Đèn viền nhẹ, bóng tiếp xúc tự nhiên và độ nét cao.',
        video_action_context: '8-second slow camera drift from rear center to slight rear three-quarter. Both shoes stationary, no fabricated heel details. No speech or on-screen text.' },
      { id: 'cv_5', label: 'Mang giày đi vài bước', lockType: 'product_and_feet',
        prompt_template: 'Khung từ đầu gối trở xuống, nhân vật tham chiếu mang đôi giày trên lối đi phẳng. Một chân trước, một chân sau chuẩn bị bước; góc thấp 3/4 bên hông, cả hai giày nhìn rõ, ánh sáng ban ngày và tỉ lệ chân giày tự nhiên.',
        video_action_context: '8-second low-angle tracking shot. Two measured steps with plausible foot contact on flat ground; both shoes identical and visible. No speech or on-screen text.' },
      { id: 'cv_6', label: 'Hero shot chừa chỗ đặt giá', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu đặt trên bục thấp ở nửa phải khung hình, góc 3/4 rõ form và đế. Nửa trái để trống với nền sáng tương phản để chèn tên, giá và lời kêu gọi hành động sau khi tạo ảnh. Ánh sáng thương mại làm rõ vật liệu, bóng thật; không tự tạo chữ, giá, chứng nhận hoặc lợi ích.',
        video_action_context: '8-second steady slow push-in toward the grounded shoes. Left text-safe space remains empty; no generated copy, speech or logos.' }
    ]
  }
};