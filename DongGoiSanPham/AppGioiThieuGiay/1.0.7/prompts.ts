import { ThemeConfig } from './types';
export const CAMPAIGN_THEMES: Record<string, ThemeConfig> = {
  lifestyle: {
    id: 'lifestyle',
    name: 'Đời sống & Streetwear',
    description: 'Phong cách tự nhiên, gần gũi, dạo phố. Tuyệt vời cho Tiktok, Reels chốt sale.',
    scenes: [
      {
        id: 'ls_1', label: 'Unboxing thấy rõ đôi giày', lockType: 'product_only',
        prompt_template: 'Hộp giấy trung tính đã mở, giấy lót gấp gọn; đôi giày tham chiếu nằm trọn trong hộp và không bị che. Góc chéo từ trên xuống 45 độ, ảnh bán hàng sáng rõ, nền bàn gỗ đơn giản. Không tạo logo giả hoặc thêm phụ kiện ngoài ảnh tham chiếu.',
        video_action_context: '6-second top-down shot. A hand folds back one tissue-paper edge, revealing more of the already visible pair; slow push-in and consistent product. Audio / ASMR: close tissue-paper crinkle, light cardboard friction as the paper is folded. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ls_2', label: 'Cầm giày trong công viên', lockType: 'product_only',
        prompt_template: 'Bàn tay nâng đôi giày tham chiếu ở góc 3/4, giày chiếm 60% khung hình, thấy rõ mũi, bên hông và đế. Lối đi công viên và cây xanh mờ phía sau; ánh sáng ban ngày dịu, bóng và tỉ lệ bàn tay chân thực. Giữ chính xác thiết kế, màu và logo theo ảnh sản phẩm; không tạo chữ.',
        video_action_context: '6-second stable medium close-up. Hand turns the pair slightly toward the camera; camera pans a few degrees to keep the side profile centered, then gently pushes in. Audio / ASMR: soft finger contact with the shoe surface, quiet park ambience and distant leaves rustling. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ls_3',
        label: 'Bước đi trong văn phòng',
        lockType: 'full_body',

        prompt_template: 'Nhân vật tham chiếu mang chính xác đôi giày tham chiếu và tự tin bước đi trong một văn phòng hiện đại cao cấp, không gian mở với bàn làm việc, kính, ánh sáng tự nhiên và các chi tiết nội thất chuyên nghiệp được làm mờ nhẹ ở hậu cảnh. Trang phục giữ theo nhân vật tham chiếu và phù hợp môi trường công sở. Mở đầu tập trung mạnh vào đôi giày khi bước trên sàn văn phòng sạch bóng, sau đó dần hé lộ toàn bộ nhân vật. Giày phải luôn dễ nhận biết, đúng kích thước và tiếp xúc sàn tự nhiên; không để quần hoặc trang phục che mất sản phẩm. Ánh sáng điện ảnh mềm từ cửa kính lớn kết hợp ánh sáng văn phòng, tạo highlight tinh tế trên giày. Giữ tuyệt đối chính xác thiết kế, màu sắc, logo, dây, vật liệu và cấu trúc đế của giày tham chiếu; không thêm hoặc thay đổi chi tiết sản phẩm.',

        video_action_context: '6-second cinematic office walk shot. Start extremely low and close beside the shoes as the character takes the first step, with the camera smoothly dollying backward only a few centimeters above floor level. During the second step, perform a controlled low-angle arc from the front three-quarter view toward the side of the character, creating strong cinematic parallax as nearby office furniture passes softly through the foreground. Then smoothly crane upward from shoe level toward waist height while continuing to track backward, gradually revealing the full character walking confidently through the office. Finish with a subtle forward push while maintaining the shoes clearly visible in the lower frame. Use smooth gimbal-like movement, realistic perspective and natural motion blur; no sudden cuts, no floating camera and no excessive slow motion. Audio / ASMR: distinct synchronized heel-to-toe footsteps on the hard office floor, subtle sole contact and friction, light clothing movement and restrained office room tone. Each footstep changes naturally from heel impact to sole contact to toe release. Background office sounds remain distant and understated. No music, no artificial whoosh. Every prominent sound must correspond to a visible physical source.'
      },
      {
        id: 'ls_4', label: 'Lookbook bước đi ngoài trời', lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu bước trên lối gạch cạnh công viên, trang phục giữ theo ảnh tham chiếu. Góc 3/4 hơi thấp, giày luôn hiện rõ ở nửa dưới khung, tư thế tự nhiên. Ánh sáng ban ngày mềm, màu sản phẩm trung thực, không để trang phục che giày.',
        video_action_context: '6-second full-body lookbook shot. Start with a waist-to-shoe tilt, then track two natural steps at a low three-quarter angle; keep footwear visible and consistent. Audio / ASMR: two natural footsteps on paving stones, light clothing rustle and distant park ambience. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ls_5',
        label: 'Đi bộ vỉa hè Việt Nam ban đêm',
        lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu đi bộ tự nhiên trên vỉa hè đường phố Việt Nam vào buổi tối, trang phục giữ theo ảnh tham chiếu và mang chính xác đôi giày tham chiếu. Góc máy thấp 3/4 từ phía trước, tập trung vào chuyển động bước chân; giày luôn rõ nét và nổi bật ở nửa dưới khung hình. Vỉa hè lát gạch đặc trưng, phía sau là cửa hàng nhỏ, biển hiệu, xe máy và ánh đèn đường đô thị Việt Nam được làm mờ bằng độ sâu trường ảnh. Ánh sáng đèn đường và ánh sáng cửa hàng phản chiếu nhẹ trên mặt đường, tạo không khí streetwear chân thực về đêm. Giữ chính xác thiết kế, màu sắc, logo, dây và cấu trúc đế của giày tham chiếu; không để quần che mất giày, không tạo chữ mới.',
        video_action_context: '6-second cinematic nighttime streetwear shot in Vietnam. Start from a low three-quarter front angle focused on the shoes, then smoothly track backward as the character takes three natural steps along the sidewalk. Add a subtle camera dip toward the footwear during the second step, followed by a gentle push-in so the shoes remain the visual focus. Natural body movement and realistic foot-to-ground contact; no slow-motion floating feet. Audio / ASMR: three distinct synchronized footsteps on tiled pavement, subtle sole friction during each heel-to-toe movement, light clothing rustle, restrained distant motorbike sounds and soft Vietnamese nighttime street ambience. A motorbike sound is heard only when a motorbike is visibly passing in the background. Footsteps remain the closest and clearest sound. No music, no artificial whoosh. All sounds occur only with their visible physical source and at natural volume.'
      },
      {
        id: 'ls_6',
        label: 'Run Street / Fashion Runway',
        lockType: 'full_body',
        prompt_template: 'Trước tiên phân tích hình dáng và mục đích sử dụng của đôi giày tham chiếu. IF the reference footwear is clearly an athletic sneaker, running shoe, training shoe or sports-oriented sneaker: nhân vật tham chiếu mang chính xác đôi giày và chạy bộ tự nhiên trên một tuyến đường đô thị Việt Nam hiện đại. Bối cảnh có vỉa hè, mặt đường, cây xanh, cửa hàng, biển hiệu và xe máy đặc trưng Việt Nam ở hậu cảnh nhưng được làm mờ điện ảnh; nhân vật và đôi giày là chủ thể chính. Trang phục tham chiếu được giữ nhất quán và phải phù hợp với hoạt động chạy bộ. ELSE, if the reference footwear is not a sports shoe: nhân vật tham chiếu mang chính xác đôi giày và bước đi tự tin trên một sàn diễn thời trang cao cấp, runway dài tối giản, ánh sáng spotlight điện ảnh, khán giả hai bên được làm mờ mạnh để tập trung hoàn toàn vào nhân vật và đôi giày. Trang phục giữ theo ảnh tham chiếu và chuyển động theo phong cách fashion walk tự nhiên. Trong cả hai trường hợp, đôi giày phải luôn nổi bật, đúng tỉ lệ, tiếp xúc mặt đất chân thực và không bị trang phục che khuất. Giữ tuyệt đối chính xác thiết kế, màu sắc, logo, dây, vật liệu và cấu trúc đế của giày tham chiếu; không thay đổi kiểu giày hoặc tạo thêm chi tiết.',
        video_action_context: '6-second highly cinematic adaptive footwear shot. IF SPORTS FOOTWEAR: begin with an extreme low-angle tracking shot directly beside the shoes as the character starts running along a Vietnamese urban street. Track parallel with the first two strides, keeping the footwear large in frame while the street background creates strong lateral parallax. Then perform a smooth dynamic arc from the side toward a front three-quarter angle while gradually pulling backward and craning upward, revealing more of the running character without losing visual emphasis on the shoes. Finish by lowering slightly toward the footwear as another foot strikes the pavement. Natural athletic gait, realistic ground contact and controlled cinematic motion blur. Audio / ASMR: rhythmic synchronized running footsteps on pavement, clear heel/forefoot impacts appropriate to the running style, subtle rubber outsole friction during push-off, light clothing movement, natural breathing kept very subtle, and restrained Vietnamese street ambience with distant motorbikes only when visually appropriate. Footsteps remain the dominant close sound.IF NON-SPORTS FOOTWEAR: begin with an extreme low-angle close tracking shot directly in front of the shoes as the character takes the first runway step. Camera smoothly dollies backward along the runway, then performs an elegant low-angle orbit from front three-quarter toward the side while maintaining the footwear as the visual anchor. During the next steps, slowly crane upward from shoe level toward a full-body fashion composition while continuing backward tracking, creating dramatic runway depth and parallax from the lights and audience. Finish with a subtle push-in as the character takes one confident final runway step. Audio / ASMR: elegant synchronized heel-to-runway or sole-to-runway impacts appropriate to the actual footwear material, subtle sole friction, natural clothing movement and extremely restrained runway room ambience. No applause unless a visibly reacting audience justifies it. FOR BOTH MODES: use one continuous fluid camera move with premium commercial cinematography, smooth gimbal/dolly motion, realistic perspective and natural motion blur. No random cuts, no impossible camera teleportation, no floating feet, no exaggerated slow motion, no music and no artificial whoosh. Every prominent sound occurs only with its visible physical source and is precisely synchronized with contact and movement.'
      }
    ]
  },
  asmr: {
    id: 'asmr',
    name: 'Review hiệu ứng ASMR',
    description: 'Phong cách hiệu ứng âm thanh kích thích xúc giác, chân thực với khoảng lặng vật lý.',
    scenes: [
      {
        id: 'asmr_1',
        label: 'Bắt giày rơi vào tay',
        lockType: 'product_only',

        prompt_template: 'Một chiếc giày tham chiếu rơi tự do từ phía trên vào giữa khung hình trên nền studio đen tuyền. Khi chiếc giày vừa tiến vào vùng trung tâm, hai bàn tay đeo găng tay đen cao cấp từ phía dưới nhanh chóng giơ lên và bắt gọn chiếc giày giữa không trung: một tay đỡ phần đế và gót, tay còn lại giữ nhẹ phần thân trước. Khoảnh khắc bắt phải thể hiện rõ trọng lượng và lực va chạm chân thực; hai bàn tay hạ xuống nhẹ vài centimet để hấp thụ quán tính rồi giữ chắc sản phẩm. Góc máy thấp chính diện hơi chếch 3/4, tạo cảm giác chiếc giày đang rơi về phía người xem. Ánh sáng studio tương phản cao với rim light mềm chạy quanh silhouette của giày và găng tay đen, tạo phong cách premium, tối giản và sang trọng. Giày luôn là chủ thể chính và chiếm khoảng 65–70% khung hình sau khi được bắt. Giữ tuyệt đối chính xác thiết kế, màu sắc, vật liệu, logo, dây giày và cấu trúc đế theo ảnh tham chiếu; không làm méo sản phẩm, không thêm chữ hoặc chi tiết mới.',

        video_action_context: '6-second premium cinematic product ASMR shot. Begin with an empty black studio frame for a brief moment. The shoe suddenly drops vertically from above with realistic gravity and a very slight natural rotation. As it reaches the center of frame, two hands wearing elegant matte-black gloves quickly rise from below and catch the shoe firmly in mid-air. At the exact moment of impact, both hands move downward a few centimeters to absorb the momentum; the gloved fingers naturally tighten around the upper, heel and sole. Hold the shoe steady for a brief beat, then make one small controlled grip adjustment to present the three-quarter side profile toward camera. Camera performs a subtle rapid push-in synchronized with the catch, then becomes completely stable for the final premium hero-product hold. No floating motion, no excessive rotation and no unrealistic deformation. Audio / ASMR: subtle air movement only while the shoe is visibly falling; one clear soft padded THUMP exactly when the shoe lands in the gloved hands; simultaneous short glove-to-fabric contact and soft textile friction; a muted sole-against-glove TAP as the lower hand absorbs the impact; delicate glove rubbing and material compression synchronized with the fingers tightening; one final soft fabric RUB during the visible grip adjustment. After all hand movement stops, return to near silence. The catch impact is the strongest sound, followed by progressively quieter tactile micro-sounds. No music, no cinematic boom, no exaggerated whoosh, no artificial sound effects and no sound without a visible physical source. Close-mic premium ASMR, clean, intimate and realistic.'
      },
      {
        id: 'asmr_2',
        label: 'Vuốt kiểm tra chất liệu thân giày',
        lockType: 'product_only',
        prompt_template: 'Macro cận cảnh phần thân bên của chiếc giày tham chiếu trên nền studio đen. Một ngón tay đeo găng đen chạm trực tiếp vào bề mặt upper, cho thấy rõ kết cấu vải, đường dệt, đường may và lớp vật liệu. Giày chiếm gần toàn bộ khung hình, độ sâu trường ảnh rất nông nhưng vùng ngón tay tiếp xúc phải sắc nét. Giữ chính xác texture, logo, màu và cấu trúc nguyên bản của sản phẩm.',
        video_action_context: '6-second tactile material shot. A fingertip slowly presses the upper, holds briefly (SILENCE), then releases and drags across the texture once. Sound only occurs during active movement/contact; total silence when finger is still or away.'
      },
      {
        id: 'asmr_3',
        label: 'Miết và bóp thử độ mềm',
        lockType: 'product_only',
        prompt_template: 'Cực cận cảnh phần upper và mép đế của giày tham chiếu. Hai đầu ngón tay đeo găng đen nhẹ nhàng bóp, miết và thả bề mặt vật liệu để thể hiện độ mềm và khả năng đàn hồi. Ánh sáng studio xiên nhẹ làm texture nổi rõ, nền đen hoàn toàn, không có vật thể thừa. Không làm biến dạng cấu trúc thật của sản phẩm.',
        video_action_context: '6-second macro tactile demonstration. Two fingers pinch the upper once, release completely (SILENCE), wait for 1 second, then rub the material slowly. Ensure audio only triggers with physical displacement.'
      },
      {
        id: 'asmr_4',
        label: 'Kéo dây giày ASMR',
        lockType: 'product_only',
        prompt_template: 'Góc top-down chính xác từ trên xuống của một chiếc giày tham chiếu đặt giữa nền studio đen. Hai bàn tay đeo găng đen cầm hai đầu dây giày ở hai bên, phần lưỡi gà, lỗ xỏ dây và toàn bộ hệ thống dây hiện rõ. Giữ nguyên chính xác số lượng, vị trí và cách luồn dây theo ảnh sản phẩm; không tự tạo thêm lỗ, dây hoặc phụ kiện.',
        video_action_context: '6-second lace ASMR shot. Hands pull the laces tight in one slow movement, hold the tension (SILENCE), then slowly release. Audio syncs exactly with the lace sliding friction and stops immediately when hands freeze.'
      },
      {
        id: 'asmr_5',
        label: 'Macro lỗ xỏ dây và đường may',
        lockType: 'product_only',
        prompt_template: 'Extreme macro của lỗ xỏ dây, dây giày và đường may trên giày tham chiếu. Khung hình cho thấy rõ kết cấu sợi dây, viền lỗ xỏ và bề mặt vải xung quanh. Ánh sáng studio mềm từ bên cạnh tạo highlight tinh tế trên vật liệu nhưng không cháy sáng. Mọi chi tiết cấu tạo phải bám chính xác ảnh sản phẩm.',
        video_action_context: '6-second macro detail shot. The lace slides through the eyelet once, then stops (SILENCE). The camera racks focus while nothing moves visually; there must be no sound during this static period.'
      },
      {
        id: 'asmr_6',
        label: 'Vuốt logo và thân bên',
        lockType: 'product_only',
        prompt_template: 'Cận cảnh 3/4 phần hông của chiếc giày tham chiếu, logo và các panel thân giày nằm rõ giữa khung hình. Một ngón tay đeo găng đen nhẹ nhàng vuốt dọc từ phần thân trước về phía logo để làm nổi texture và các lớp vật liệu. Nền studio đen, ánh sáng tương phản cao nhưng sản phẩm vẫn giữ màu trung thực. Logo phải giữ chính xác, không sửa chữ hoặc hình dạng.',
        video_action_context: '6-second side-profile ASMR. Finger traces the material across a seam, pauses for 1 second on the logo (SILENCE), then continues. The sound should clearly register the seam crossing then cut to silence when still.'
      },
      {
        id: 'asmr_7',
        label: 'Ấn thử độ đàn hồi đế',
        lockType: 'product_only',
        prompt_template: 'Macro phần đế giữa và mép đế của chiếc giày tham chiếu. Ngón tay đeo găng đen ấn trực tiếp vào vùng vật liệu đế có thể đàn hồi, thể hiện phản ứng vật lý chân thực. Góc máy ngang sát sản phẩm để nhìn rõ độ dày và cấu trúc đế. Không làm đế biến dạng quá mức hoặc thay đổi cấu trúc nguyên bản.',
        video_action_context: '6-second macro cushioning shot. A thumb presses the midsole once, releases fully (SILENCE), wait 2 seconds, then light rapid taps (2 times) with a finger. Audio matches the impacts and releases with no background noise.'
      },
      {
        id: 'asmr_8',
        label: 'Lật giày soi toàn bộ đế',
        lockType: 'product_only',
        prompt_template: 'Hai bàn tay đeo găng đen cầm chắc chiếc giày tham chiếu trên nền studio đen và xoay để phần outsole hướng hoàn toàn về camera. Toàn bộ mặt đế nằm giữa khung hình, sắc nét và đủ sáng để nhìn rõ rãnh, pattern và vùng tiếp xúc. Giữ chính xác cấu trúc outsole theo sản phẩm tham chiếu; không sáng tạo pattern mới.',
        video_action_context: '6-second rotation shot. Hands rotate the shoe to face the outsole toward camera, then hold perfectly still for 4 seconds (SILENCE). Audio only during the rotation movement friction.'
      },
      {
        id: 'asmr_9',
        label: 'Miết rãnh đế giày',
        lockType: 'product_only',
        prompt_template: 'Extreme macro mặt outsole của chiếc giày tham chiếu. Một ngón tay đeo găng đen chạm vào các rãnh và khối cao su trên đế, lần lượt ấn và trượt qua pattern để cho thấy chiều sâu và texture. Ánh sáng xiên làm các rãnh đế nổi khối rõ ràng. Pattern và logo trên đế phải giữ chính xác theo ảnh sản phẩm.',
        video_action_context: '6-second outsole detail. Finger taps one tread block, slides to the next (SILENCE between), then rubs the rubber texture. Clear intermittent sound following the finger action.'
      },
      {
        id: 'asmr_10',
        label: 'Đặt đôi giày xuống bàn studio',
        lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu được đặt cạnh nhau trên mặt bàn studio đen mờ. Góc thấp 3/4 cho thấy rõ mũi, thân bên và form đế của cả hai chiếc. Hai bàn tay đeo găng đen chỉnh nhẹ vị trí để đôi giày cân đối như hero product shot. Ánh sáng studio mềm tạo highlight viền và bóng tiếp xúc chân thực. Không thay đổi thiết kế, logo, màu hoặc tỉ lệ sản phẩm.',
        video_action_context: '6-second final hero shot. Hands place both shoes on the table (two distinct impact sounds), adjust them slightly, then hands exit frame. Once hands exit and shoes are still, the remaining 4 seconds must be TOTAL SILENCE.'
      }
    ]
  },
  conversion: {
    id: 'conversion', name: 'Cảnh chốt sale & Chi tiết',
    description: 'Sáu góc bổ sung giúp khách nhìn rõ sản phẩm trước khi mua.',
    scenes: [
      { id: 'cv_1', label: 'Toàn bộ đôi giày 3/4', lockType: 'product_only',
        prompt_template: 'Đúng một đôi giày tham chiếu trên nền studio sáng. Chiếc trước góc 3/4, chiếc sau góc bên, nhìn rõ mũi, thân, gót và đế; cả hai cùng màu và thiết kế. Sản phẩm sắc nét, bóng mềm, không cắt mép, không chữ hoặc phụ kiện bịa thêm.',
        video_action_context: '6-second short smooth camera arc from front three-quarter toward side. Both shoes still, fully visible and unchanged. Audio / ASMR: quiet studio room tone, no impact while both shoes remain still. Sounds occur only with their visible source, at natural volume.' },
      { id: 'cv_2', label: 'Góc bên thấy form và đế', lockType: 'product_only',
        prompt_template: 'Một chiếc giày tham chiếu ở góc nghiêng bên 90 độ đặt vững trên bề mặt trung tính, chiếc còn lại mờ nhẹ phía sau. Toàn bộ đường thân, gót và cạnh đế rõ nét, ánh sáng ngang dịu. Giữ đúng chiều cao đế, tỉ lệ, màu, chất liệu và logo.',
        video_action_context: '6-second static side-profile with a small lateral camera slide. Shoe grounded; silhouette and sole edge remain identical. Audio / ASMR: near-silent studio ambience, no footstep or fabric sound without visible action. Sounds occur only with their visible source, at natural volume.' },
      { id: 'cv_3', label: 'Cận mũi và chất liệu', lockType: 'product_only',
        prompt_template: 'Ảnh macro phần mũi và chất liệu thật nhìn thấy được của giày tham chiếu. Góc 3/4 từ hơi trên cao; mũi giày sắc nét, phần còn lại mờ nhẹ nhưng vẫn nhận ra cùng mẫu. Ánh sáng mềm, màu thật; không tạo lỗ thoáng, đường may hoặc logo không có trong ảnh gốc.',
        video_action_context: '6-second macro glide from the toe to one actual visible material detail. Shift focus gently along the real surface; no invented seams or marks. Audio / ASMR: restrained texture-focused brushing only if the material visibly moves; otherwise near silence. Sounds occur only with their visible source, at natural volume.' },
      { id: 'cv_4', label: 'Gót giày từ phía sau', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu nhìn từ phía sau ở góc ngang tầm gót, đặt cân đối trên nền studio sáng. Form gót, thân và đế phù hợp ảnh tham chiếu; không giả định có logo hoặc phụ kiện ở vị trí không thấy rõ. Đèn viền nhẹ, bóng tiếp xúc tự nhiên và độ nét cao.',
        video_action_context: '6-second slow camera drift from rear center to slight rear three-quarter. Both shoes stationary, no fabricated heel details. Audio / ASMR: quiet studio room tone, no fabricated heel clicks. Sounds occur only with their visible source, at natural volume.' },
      { id: 'cv_5', label: 'Mang giày đi vài bước', lockType: 'product_and_feet',
        prompt_template: 'Khung từ đầu gối trở xuống, nhân vật tham chiếu mang đôi giày trên lối đi phẳng. Một chân trước, một chân sau chuẩn bị bước; góc thấp 3/4 bên hông, cả hai giày nhìn rõ, ánh sáng ban ngày và tỉ lệ chân giày tự nhiên.',
        video_action_context: '6-second low-angle lookbook tracking shot. Begin on the side profile, then follow two measured steps with plausible sole contact on level ground; keep both shoes in frame. Audio / ASMR: two soft, synchronized footsteps matching visible sole contact with the walkway. Sounds occur only with their visible source, at natural volume.' },
      { id: 'cv_6', label: 'Hero shot chừa chỗ đặt giá', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu đặt trên bục thấp ở nửa phải khung hình, góc 3/4 rõ form và đế. Nửa trái để trống với nền sáng tương phản để chèn tên, giá và lời kêu gọi hành động sau khi tạo ảnh. Ánh sáng thương mại làm rõ vật liệu, bóng thật; không tự tạo chữ, giá, chứng nhận hoặc lợi ích.',
        video_action_context: '6-second steady slow push-in toward the grounded shoes. Left text-safe space remains empty; no generated copy, speech or logos. Audio / ASMR: quiet studio ambience and a light airy transition, no spoken price or offer. Sounds occur only with their visible source, at natural volume.' }
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
        video_action_context: '6-second short camera arc around the stable pedestal, revealing side and heel. Constant soft lighting, both shoes fixed and identical. Audio / ASMR: soft studio room tone and a very subtle camera pass, no invented impacts. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'st_2', label: 'Nền lụa studio cao cấp', lockType: 'product_only',
        prompt_template: 'Đôi giày đặt trên mặt phẳng sáng, vải lụa màu kem chỉ ở hậu cảnh và không che sản phẩm. Góc 3/4 hơi cao cho thấy form và chất liệu, bóng đổ tự nhiên. Chừa vùng trống phía trên để thêm chữ sau khi tạo ảnh; không tạo chữ trong ảnh.',
        video_action_context: '6-second gentle lateral camera slide; only loose background fabric moves slightly. Shoes stay grounded, still and sharp. Audio / ASMR: gentle silk rustle matching visible fabric motion, quiet studio room tone. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'st_3', label: 'Mang giày trên nền đen phản chiếu', lockType: 'product_and_feet',
        prompt_template: 'Khung hình từ đầu gối trở xuống, nhân vật tham chiếu đứng vững với đúng đôi giày trên sàn đen phản chiếu nhẹ. Góc thấp 3/4 làm rõ mũi, bên hông và cạnh đế; đèn viền cùng đèn chính đủ sáng để thấy đúng màu. Không lộ mặt hoặc kéo dài chân, phản chiếu vật lý chính xác.',
        video_action_context: '6-second slow push-in. One foot pivots slightly while the other stays planted; reflection follows accurately. Shoe details remain consistent. Audio / ASMR: one soft shoe pivot on the glossy floor, quiet room tone. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'st_4', label: 'Nước nghệ thuật phía sau sản phẩm', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu đặt vững trên bục tối phản chiếu. Dải chất lỏng nghệ thuật có màu hài hòa chuyển động ở xa trong hậu cảnh, không chạm hoặc che sản phẩm. Góc 3/4 thấp, đèn chính làm rõ logo, bề mặt và form đế; giày giữ đúng thiết kế từ ảnh gốc.',
        video_action_context: '6-second slow camera arc. Decorative liquid moves only in the background; shoes remain fixed and grounded, reflections consistent. Audio / ASMR: restrained liquid swish synchronized with the background ribbon, quiet studio ambience. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'st_5', label: 'Spotlight trên bục tối', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu đặt trên bục đen mờ: một chiếc góc bên thấy đế và thân, chiếc còn lại góc 3/4 thấy mũi. Quầng sáng ở nền phía sau, đèn chính đủ sáng cho chất liệu và màu sắc, bóng tiếp xúc thật. Không để vùng tối nuốt mất chi tiết.',
        video_action_context: '6-second slow push-in. Background spotlight brightens gently while key light on the still shoes stays constant. Audio / ASMR: near-silent studio room tone, gentle airy emphasis as the camera approaches. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'st_6', label: 'Cận cảnh chi tiết có thật', lockType: 'product_only',
        prompt_template: 'Cận cảnh một chi tiết thực sự thấy được trên ảnh giày tham chiếu: bề mặt, đường may, quai, dây hoặc mép đế nếu có. Bàn tay nhẹ nhàng chạm vào chi tiết nhưng không che giày; tỉ lệ bàn tay hợp lý, ánh sáng mềm, hậu cảnh mờ. Không tự tạo khóa, quai, logo hoặc công năng chưa có.',
        video_action_context: '6-second close-up macro pass across one real visible shoe detail. Hand brushes the detail once; focus follows the contact point without changing product structure. Audio / ASMR: close fingertip brushing the real shoe material once, with texture-appropriate friction. Sounds occur only with their visible source, at natural volume.'
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
        video_action_context: '6-second stable product shot with very slow push-in. Leave text-safe areas empty; shoe stays still and sharp. Audio / ASMR: quiet studio ambience, subtle airy camera movement with no invented product sound. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ed_2', label: 'Banner sản phẩm và người mang', lockType: 'full_body',
        prompt_template: 'Bố cục chia đôi: trái là đôi giày tham chiếu góc 3/4 trên nền studio trắng; phải là nhân vật tham chiếu ngồi trên bậc đá mang đúng đôi giày đó. Cả hai nửa cùng màu và chi tiết sản phẩm, giày không bị cắt mũi hoặc đế. Dải trống phía trên dành cho tiêu đề thêm sau; không tạo chữ hoặc giá.',
        video_action_context: '6-second split composition. Left shoes still; right character shifts one foot slightly. Product appearance matches exactly between panels. Audio / ASMR: soft shoe movement on the stair at right, light street ambience; left panel remains silent. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ed_3', label: 'Tạp chí phối đồ và cận giày', lockType: 'full_body',
        prompt_template: 'Bố cục hai khung: trái nhân vật tham chiếu đứng trước gương, mặc trang phục tham chiếu và mang giày nhìn rõ; phải là cận cảnh cùng đôi giày trên nền kem. Ánh sáng mềm, hai khung nhất quán về nhân vật và sản phẩm, chừa vùng trống để thêm chữ sau. Không tự tạo chữ hoặc nhãn hiệu.',
        video_action_context: '6-second two-panel shot. Left character subtly shifts stance; right product remains still with slight push-in. Outfit and shoes consistent across both panels. Audio / ASMR: faint clothing rustle in the left panel, quiet room ambience; right panel silent. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ed_4', label: 'Sofa tập trung vào giày', lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu ngồi tự nhiên trên sofa vải kem, hai chân mang đúng đôi giày tham chiếu ở tiền cảnh. Góc thấp 3/4, giày sắc nét và không bị che. Phòng sáng với tạp chí mờ ở hậu cảnh; ánh sáng cửa sổ mềm, giữ nhận diện, trang phục và giày theo ảnh tham chiếu.',
        video_action_context: '6-second medium shot. Character settles both feet naturally; camera drifts slightly toward the shoes. Consistent anatomy and footwear. Audio / ASMR: gentle sofa fabric rustle and a soft shoe contact with the floor. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ed_5', label: 'Flat lay pop-art tươi sáng', lockType: 'product_only',
        prompt_template: 'Góc từ trên xuống 90 độ, đôi giày đặt song song hơi lệch góc trên nền vàng sáng. Các hình tròn trang trí ở xa mép giày, không che mũi, gót, thân hoặc logo. Ánh sáng đều, bóng mềm, vùng trống phía trên để thêm thông điệp bán hàng sau; không tạo chữ.',
        video_action_context: '6-second top-down shot with a very slow zoom-in; background circles move gently without covering the fixed shoes. Audio / ASMR: very subtle graphic whoosh synchronized to the moving circles, no product impact. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'ed_6', label: 'KOC cầm giày giới thiệu', lockType: 'full_body',
        prompt_template: 'Nhân vật tham chiếu đứng trong phòng sáng đơn giản, hai tay đưa đôi giày tham chiếu ngang ngực hướng về máy. Giày chiếm 45% khung và sắc nét nhất; gương mặt vẫn nhận diện được phía sau, nét dịu hơn. Cầm chắc, không che logo hoặc chi tiết giày, giữ diện mạo và trang phục theo ảnh nhân vật.',
        video_action_context: '6-second continuous KOC presentation. Begin at face-and-product level, tilt gently from the character to the shoes, then hold as the pair turns once to reveal the side; keep product sharp. Audio / ASMR: light hand-to-shoe friction as the character tilts the pair, quiet indoor ambience. Sounds occur only with their visible source, at natural volume.'
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
        video_action_context: '6-second wide-to-medium push-in. Character turns slightly toward camera with a natural weight shift; oversized display remains still and the actual shoes on feet stay consistent. Audio / ASMR: one natural shoe step or fabric rustle from the character, light studio ambience. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'cr_2', label: 'Sản phẩm trên khối hình học', lockType: 'product_only',
        prompt_template: 'Đôi giày đặt trên hai bệ hình học trắng cao thấp khác nhau, có điểm tựa rõ ràng. Góc 3/4 thấy toàn bộ form, vải rủ màu kem ở hậu cảnh; khoảng trống bên trái dành cho tiêu đề thêm sau. Ánh sáng mềm, bóng tiếp xúc vật lý chính xác, không tạo chữ.',
        video_action_context: '6-second gentle rising camera move revealing pedestal heights and side profiles; shoes remain fixed and grounded. Audio / ASMR: soft fabric rustle from the visible drape and quiet studio room tone. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'cr_3', label: 'Nền pop-art năng động', lockType: 'product_only',
        prompt_template: 'Đôi giày tham chiếu nằm giữa khung trên mặt phẳng sạch ở góc 3/4. Đường đồ họa lượn sóng và mảng màu tương phản chỉ ở nền, không đè lên sản phẩm. Giày giữ chất ảnh chụp chân thực, đủ sáng, rõ màu và logo; chừa khoảng trống để thêm chữ sau.',
        video_action_context: '6-second fixed camera; background graphic lines animate subtly toward the still photorealistic shoes. Audio / ASMR: light, understated graphic whoosh timed to the background lines, product stays silent. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'cr_4', label: 'Neon viền sản phẩm', lockType: 'product_only',
        prompt_template: 'Đôi giày trên bục thấp ở góc 3/4 ngang tầm. Nền gradient tối với đèn neon ở xa; đèn chính trung tính vẫn cho thấy đúng màu, vật liệu và chi tiết. Sản phẩm chiếm 65% khung, có bóng tiếp xúc, không chữ hoặc logo tự tạo.',
        video_action_context: '6-second slow sideways camera move. Neon background shifts gently, neutral product light stays constant; shoes remain grounded. Audio / ASMR: faint electric ambience from the visible neon lights, no exaggerated buzzing. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'cr_5', label: 'Không khí âm nhạc đường phố', lockType: 'product_and_feet',
        prompt_template: 'Khung từ đầu gối trở xuống: nhân vật tham chiếu ngồi trên ghế cạnh loa trang trí, hai chân mang giày tham chiếu đặt trên sàn. Góc thấp 3/4, đôi giày sắc nét, loa ở nền mờ. Ánh sáng màu chỉ hắt vào nền; mặt giày có đèn trung tính để giữ màu chính xác.',
        video_action_context: '6-second stable low-angle shot. Seated character changes foot position once; camera makes a small push-in. Background lights move subtly, shoes remain consistent. Audio / ASMR: soft shoe repositioning on the floor and low ambient room tone, no music. Sounds occur only with their visible source, at natural volume.'
      },
      {
        id: 'cr_6', label: 'Giày trẻ em trên lòng bàn tay', lockType: 'product_only',
        prompt_template: 'Chỉ dùng cảnh này nếu sản phẩm tham chiếu thật sự là giày trẻ em. Bàn tay người lớn đỡ một chiếc giày đúng kích thước thực; chiếc còn lại đặt gần đó trên bàn. Góc 3/4 cận cảnh, nền công viên sáng mờ, trọng lượng và tỉ lệ vật lý hợp lý. Không thu nhỏ giày người lớn.',
        video_action_context: '6-second close-up. Hand raises the child-size shoe a few centimeters and holds steady; second shoe stays on the table. Maintain realistic scale and design. Audio / ASMR: gentle fingers against the child-size shoe and soft outdoor ambience. Sounds occur only with their visible source, at natural volume.'
      }
    ]
  }
};