export interface Article {
  id: number;
  title: string;
  category: string;
  categoryKey: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  isFeatured?: boolean;
  contentBody?: string;
}

export const ARTICLES: Article[] = [
  // ================= TAB 1: THÔNG BÁO (thong-bao) =================
  {
    id: 1,
    title: 'VIAGO mở thêm chuyến Hà Nội - Quảng Ninh',
    category: 'Thông báo',
    categoryKey: 'thong-bao',
    date: '08/05/2026',
    excerpt: 'Tăng cường chuyến mới phục vụ nhu cầu đi lại của quý hành khách giữa thủ đô Hà Nội và tỉnh Quảng Ninh bằng dòng xe Limousine giường nằm VIP chất lượng cao.',
    imageUrl: '/asset/images/customer/xe.jpg',
    isFeatured: true,
    contentBody: `Với tiêu chí hoạt động mang tính kim chỉ nam “Vạn dặm bình an”, Công ty TNHH Vận tải VIAGO luôn không ngừng đổi mới và nâng cao trải nghiệm của khách hàng trên mỗi hành trình. Nhằm đáp ứng nhu cầu di chuyển ngày càng cao của quý hành khách, đặc biệt là xu hướng lựa chọn các dòng xe chất lượng cao cho những chặng hành trình dài. Tháng 5/2026, VIAGO chính thức đưa vào vận hành dòng xe phòng thương gia cao cấp THACO Mobihome 22 Phòng Premium trên tuyến Hà Nội - Quảng Ninh.

Đây là dòng xe đẳng cấp với công nghệ và độ an toàn hàng đầu trong phân khúc xe khách giường nằm hiện nay, được mệnh danh là những “Chuyên cơ mặt đất” di động. Hứa hẹn mang tới cho quý hành khách những trải nghiệm hoàn toàn mới về dịch vụ vận tải hành khách đường bộ.

### Lịch trình xuất bến cụ thể hàng ngày:
* **Từ Hà Nội (Văn phòng Mỹ Đình & Bến xe Giáp Bát):** 06:00, 08:30, 11:00, 13:30, 15:30, 18:00, 20:30.
* **Từ Quảng Ninh (Cảng tàu Tuần Châu & Văn phòng Hạ Long):** 05:30, 08:00, 10:30, 13:00, 15:00, 17:30, 20:00.

### Những tiện ích vượt trội chỉ có trên xe phòng VIP Limousine của VIAGO:
1. **Không gian riêng tư tuyệt đối:** Xe được thiết kế tinh tế với 22 phòng riêng biệt, mỗi phòng đều có rèm che đóng kín đáo, tránh hoàn toàn với lối đi chung. Hành khách có thể thoải mái nghỉ ngơi, làm việc hoặc giải trí trong không gian độc lập của riêng mình mà không sợ bị làm phiền.
2. **Giường nằm thương gia tích hợp massage:** Hệ thống giường nằm được bọc da cao cấp, êm ái, có kích thước rộng rãi phù hợp cho cả hành khách trong và ngoài nước. Đặc biệt, giường có chế độ chỉnh gập ngả linh hoạt (bằng điện), kết hợp chức năng massage nhiều chế độ giúp lưu thông khí huyết, xua tan cảm giác mỏi mệt trên những chặng đường dài hàng trăm kilomet.
3. **Tiện ích giải trí cá nhân:** Mỗi phòng cabin được trang bị một màn hình LCD 15.6 inch sắc nét, tích hợp sẵn kho phim bom tấn, ca nhạc và trò chơi đa dạng. Hệ thống tai nghe chụp tai chống ồn cao cấp mang lại thế giới âm thanh sống động riêng tư. Cổng sạc nhanh USB và ổ cắm điện 220V ngay tại vị trí nằm giúp hành khách dễ dàng sạc pin điện thoại, máy tính bảng hay laptop suốt chuyến đi.
4. **Hệ thống điều hòa và lọc không khí ion:** Giữ không gian trong xe luôn mát mẻ và trong lành, kết hợp với hương thơm tinh dầu tự nhiên dịu nhẹ mang lại cảm giác thư thái tối đa, giảm thiểu triệu chứng say xe.

Quý khách có thể đặt vé trực tiếp thông qua Tổng đài CSKH 1900 1234 hoặc truy cập Website chính thức của nhà xe VIAGO để chọn trước vị trí giường phòng ưng ý.`
  },
  {
    id: 2,
    title: 'Cập Nhật Lịch Trình 6 Chuyến Cố Định Mỗi Ngày Tăng Cường Phục Vụ',
    category: 'Thông báo',
    categoryKey: 'thong-bao',
    date: '24/05/2026',
    excerpt: 'Nhằm đáp ứng nhu cầu đi lại ngày càng cao của hành khách, nhà xe VIAGO chính thức cập nhật lịch trình chạy mới thông thoáng hơn.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Để tối ưu hóa thời gian di chuyển của khách hàng, nhà xe VIAGO công bố lịch trình nâng cấp mới của 6 chuyến xe cố định hàng ngày kết nối các thành phố lớn trọng điểm như Sài Gòn, Nha Trang, Đà Lạt, Đà Nẵng, Hà Nội và Sapa.

Quyết định tăng tần suất và cố định giờ xuất bến giúp hành khách dễ dàng chủ động sắp xếp thời gian biểu cá nhân, công việc hay các kế hoạch du lịch mà không lo thiếu chỗ. Các chuyến xe đều được trang bị đầy đủ nước uống, khăn lạnh và điều hòa mát mẻ suốt hành trình.

### Chi tiết các tuyến xe cố định nâng cấp:
1. **Tuyến Sài Gòn - Đà Lạt:** 3 chuyến ngày (08:00, 13:00, 22:00) và 3 chuyến đêm (23:00, 23:30, 23:45). Tận dụng tối đa thời gian để hành khách ngủ một giấc ngon và đón bình minh tại Đà Lạt.
2. **Tuyến Sài Gòn - Nha Trang:** Khởi hành liên tục vào lúc 09:00, 12:00, 20:30, 21:00, 21:30, 22:00 hàng ngày.
3. **Tuyến Hà Nội - Sapa:** Chạy cao tốc Nội Bài - Lào Cai với các khung giờ 06:30, 10:00, 13:30, 15:30, 22:00, 22:30.
4. **Tuyến Đà Nẵng - Huế:** Tần suất liên tục 2 tiếng/chuyến bắt đầu từ 06:00 sáng đến 20:00 tối hàng ngày.

### Quy định đón trả khách tận nơi và trung chuyển miễn phí:
* Tại khu vực nội thành Sài Gòn (Quận 1, 3, 5, 10, Bình Thạnh, Gò Vấp), xe trung chuyển đón trước giờ khởi hành 45 phút.
* Tại Đà Lạt, xe trung chuyển hỗ trợ trả khách tận nơi trong bán kính 10km quanh trung tâm thành phố (Hồ Xuân Hương, chợ Đà Lạt, các homestay phường 11, 12).
* Hỗ trợ đổi trả vé miễn phí trước 24 giờ so với giờ xe chạy đối với ngày thường, và trước 48 giờ đối với các dịp lễ Tết.`
  },
  {
    id: 3,
    title: 'Thông báo điều chỉnh sơ đồ ghế ngồi và nâng cấp hệ thống đặt vé trực tuyến',
    category: 'Thông báo',
    categoryKey: 'thong-bao',
    date: '15/06/2026',
    excerpt: 'Để thuận tiện hơn cho khách hàng trong việc theo dõi sơ đồ xe và thanh toán đặt chỗ, VIAGO nâng cấp toàn bộ hệ thống đặt vé phiên bản mới.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `VIAGO chính thức thông báo nâng cấp toàn diện giao diện đặt vé trực tuyến trên website và ứng dụng di động từ ngày 20/06/2026. Phiên bản nâng cấp này mang lại nhiều tính năng tối ưu giúp hành khách dễ dàng lựa chọn vị trí ngồi và thực hiện thanh toán nhanh chóng chỉ trong 30 giây.

### Các thay đổi quan trọng bao gồm:
1. **Sơ đồ xe trực quan 3D:** Hiển thị vị trí ghế nằm, cabin VIP và xe limousine 9 chỗ một cách sống động, giúp khách hàng hình dung rõ ràng vị trí cửa lên xuống, nhà vệ sinh tự động trên xe và khoảng cách giữa các hàng ghế.
2. **Tích hợp thanh toán đa cổng:** Thêm phương thức thanh toán Apple Pay, Google Pay cùng các ví điện tử phổ biến như MoMo, ZaloPay, ShopeePay và cổng VNPAY-QR với độ bảo mật cao chuẩn quốc tế.
3. **Quản lý hành trình thông minh:** Khách hàng có thể tự tra cứu lịch sử đi lại, lấy hóa đơn điện tử VAT trực tiếp từ hệ thống mà không cần liên hệ tổng đài.

Chúng tôi hi vọng đợt cải tiến công nghệ này sẽ mang lại trải nghiệm tối đa, giúp quý khách tiết kiệm tối đa thời gian chuẩn bị cho mỗi chuyến hành trình.`
  },
  {
    id: 4,
    title: 'Thông báo lịch vận hành phục vụ Tết Nguyên Đán 2027 và mở bán vé sớm',
    category: 'Thông báo',
    categoryKey: 'thong-bao',
    date: '15/10/2026',
    excerpt: 'Chuẩn bị cho dịp Tết đoàn viên, VIAGO chính thức mở bán vé Tết sớm hơn 3 tháng nhằm hỗ trợ bà con chủ động sắp xếp lịch trình về quê.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Để giải quyết tình trạng khan hiếm vé xe và ùn tắc dịp cao điểm cuối năm, Công ty TNHH Vận tải VIAGO ban hành kế hoạch mở bán vé xe Tết Nguyên Đán 2027 bắt đầu từ ngày 01/11/2026.

### Kế hoạch phục vụ chi tiết:
* **Thời gian cao điểm áp dụng:** Từ ngày 20/12/2026 đến hết ngày 10/01/2027 âm lịch.
* **Tăng cường thêm 150 đầu xe:** Tập trung chủ yếu ở các tuyến trọng điểm từ TP.HCM đi các tỉnh miền Trung, Tây Nguyên và tuyến Hà Nội đi các tỉnh Tây Bắc.
* **Cam kết bình ổn giá:** VIAGO cam kết chỉ thu phụ thu theo đúng quy định của Sở Giao thông Vận tải đối với chiều chạy rỗng, hoàn toàn không có tình trạng tự ý nâng giá vé bất hợp pháp hay nhồi nhét khách trên xe.

Khách hàng nên tải ứng dụng VIAGO để nhận thông báo về khung giờ mở bán chính xác của từng tuyến đường và thực hiện đặt chỗ sớm nhất nhằm tránh bỏ lỡ cơ hội sum vầy cùng gia đình.`
  },
  {
    id: 5,
    title: 'Thông báo quy định mới về kích thước hành lý ký gửi và miễn cước hành lý xách tay',
    category: 'Thông báo',
    categoryKey: 'thong-bao',
    date: '02/11/2026',
    excerpt: 'VIAGO điều chỉnh quy định về trọng lượng và kích thước hành lý đi kèm để đảm bảo an toàn vận hành tối đa cho các phương tiện.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Để đảm bảo khoang chứa hành lý (cốp xe) luôn được sắp xếp khoa học, an toàn, tránh quá tải trọng ảnh hưởng đến hệ thống giảm chấn của xe, VIAGO áp dụng quy định mới về quản lý hành lý của hành khách kể từ ngày 15/11/2026.

### Nội dung quy định cụ thể:
1. **Hành lý xách tay (Miễn phí):** Mỗi hành khách được mang theo tối đa 1 túi xách hoặc balo cá nhân nặng không quá 5kg, kích thước vừa vặn dưới gầm ghế hoặc khay để đồ cá nhân trong cabin.
2. **Hành lý ký gửi (Miễn cước theo vé):** Mỗi vé xe Limousine VIP bao gồm tiêu chuẩn ký gửi 1 vali hoặc kiện đồ có trọng lượng tối đa 20kg và tổng kích thước 3 chiều không vượt quá 150cm.
3. **Hành lý quá khổ hoặc hàng hóa đặc biệt:** Đối với các vật dụng như xe đạp thể thao, nhạc cụ lớn hoặc hải sản tươi sống, hành khách vui lòng liên hệ trước với phòng vé tối thiểu 12 tiếng trước khi đi để được bố trí chỗ xếp phù hợp và thanh toán phụ phí ký gửi phát sinh theo biểu giá niêm yết.

Kính mong quý hành khách lưu ý thực hiện đúng quy định để chuyến hành trình khởi hành thuận lợi và đúng giờ.`
  },

  // ================= TAB 2: KHUYẾN MÃI (khuyen-mai) =================
  {
    id: 6,
    title: 'Ưu Đãi Hè Rực Rỡ: Giảm Ngay 10% Giá Vé Phòng Limousine Khứ Hồi',
    category: 'Khuyến mãi',
    categoryKey: 'khuyen-mai',
    date: '24/05/2026',
    excerpt: 'Chào mùa du lịch hè 2026, VIAGO hân hạnh mang chương trình ưu đãi cực lớn, giảm thẳng 10% giá vé khi hành khách đặt chỗ khứ hồi.',
    imageUrl: '/asset/images/customer/summer.jpg',
    contentBody: `Chào đón mùa hè sôi động 2026, VIAGO mang lại chương trình tri ân khách hàng quy mô lớn nhất trong năm. Theo đó, tất cả hành khách mua vé khứ hồi cho bất kỳ chặng đi nào bằng xe Limousine VIP sẽ nhận ngay ưu đãi giảm 10% trên tổng giá trị hóa đơn vé.

Chương trình diễn ra từ ngày 01/06/2026 đến hết 31/08/2026. Đây là cơ hội tuyệt vời để cùng gia đình và bạn bè tổ chức những chuyến đi tránh nóng lý tưởng đến Đà Lạt, Nha Trang hay Sapa với mức chi phí vô cùng tiết kiệm.

### Hướng dẫn nhận mã ưu đãi giảm giá khứ hồi:
1. **Đặt vé qua Website/App:** Hệ thống sẽ tự động nhận diện hành trình khứ hồi khi bạn chọn điểm đi, điểm đến và chọn cả ngày đi lẫn ngày về trong cùng một giao dịch đặt vé. Chiết khấu 10% sẽ được trừ trực tiếp vào hóa đơn thanh toán cuối cùng trước khi chuyển qua cổng VNPay/MoMo.
2. **Đặt vé qua Hotline 1900 1234:** Quý khách chỉ cần thông báo với điện thoại viên nhu cầu đặt vé khứ hồi, nhân viên sẽ giữ chỗ cả hai chiều đi - về và áp dụng ngay mức chiết khấu giảm 10% vé chiều về cho quý khách.
3. **Mua vé tại Quầy giao dịch:** Áp dụng tại tất cả các văn phòng đại diện của VIAGO trên toàn quốc.

### Điều kiện áp dụng ưu đãi:
* Chiều về phải khởi hành trong vòng 30 ngày kể từ ngày đi của chiều đi.
* Không áp dụng đồng thời với các chương trình khuyến mãi khác của nhà xe.
* Vé khứ hồi khuyến mãi vẫn được hỗ trợ đổi ngày giờ chạy (tối đa 1 lần miễn phí) nếu thông báo trước 24 giờ khởi hành.`
  },
  {
    id: 7,
    title: 'Mừng Quốc khánh 2/9: Giảm 20% khi đặt qua App VIAGO',
    category: 'Khuyến mãi',
    categoryKey: 'khuyen-mai',
    date: '01/09/2026',
    excerpt: 'Đồng hành cùng hành trình đoàn viên dịp Tết Độc lập, VIAGO áp dụng chương trình khuyến mại đặc biệt dành cho mọi hành khách đặt vé online.',
    imageUrl: '/asset/images/customer/summer.jpg',
    contentBody: `Hòa chung không khí tưng bừng mừng ngày Tết Độc lập Quốc khánh 2/9, VIAGO chính thức ra mắt mã ưu đãi giảm trực tiếp 20% giá trị vé cho khách hàng thực hiện đặt vé qua ứng dụng điện thoại chính thức của VIAGO.

Chúng tôi hiểu rằng đây là dịp nghỉ lễ ý nghĩa để mọi người trở về quê hương quây quan bên gia đình hoặc tự thưởng cho bản thân một chuyến du lịch ngắn ngày. Đội ngũ tài xế và nhân viên phục vụ của VIAGO cam kết hoạt động hết công suất để mang đến những chuyến đi đúng giờ và an toàn nhất.

### Chi tiết chương trình khuyến mại 2/9:
* **Mã giảm giá:** \`VIAGO29\` (Nhập tại màn hình thanh toán trên App VIAGO).
* **Mức giảm:** Giảm ngay 20% tổng giá trị hóa đơn (Tối đa 100,000 VND / giao dịch).
* **Thời gian đặt vé:** Từ ngày 25/08/2026 đến hết ngày 03/09/2026.
* **Thời gian khởi hành chuyến đi:** Từ ngày 30/08/2026 đến hết ngày 05/09/2026.
* **Đối tượng:** Tất cả hành khách đặt vé trực tuyến thông qua ứng dụng di động VIAGO trên cả hai nền tảng iOS và Android.

Hãy tải ngay App VIAGO từ App Store hoặc Google Play để nhận thông tin khuyến mãi và cập nhật vị trí xe chạy theo thời gian thực một cách nhanh chóng nhất!`
  },
  {
    id: 8,
    title: 'Khuyến mãi mùa tựu trường: Giảm 15% cho học sinh - sinh viên',
    category: 'Khuyến mãi',
    categoryKey: 'khuyen-mai',
    date: '25/08/2026',
    excerpt: 'Đồng hành cùng các bạn học sinh, sinh viên bước vào năm học mới, VIAGO giảm giá vé đặc biệt trên toàn bộ mạng lưới tuyến.',
    imageUrl: '/asset/images/customer/summer.jpg',
    contentBody: `Nhằm hỗ trợ các bạn tân sinh viên và học sinh quay trở lại trường học sau kỳ nghỉ hè, VIAGO tổ chức chương trình "Tiếp sức đến trường 2026" với nhiều ưu đãi thiết thực.

### Chi tiết chương trình ưu đãi học sinh - sinh viên:
* **Nội dung:** Giảm trực tiếp 15% giá vé xe khách Limousine giường nằm VIP trên tất cả các tuyến liên tỉnh của VIAGO.
* **Thời gian diễn ra:** Từ 01/09/2026 đến hết ngày 30/09/2026.
* **Cách thức nhận ưu đãi:** 
  1. Khi mua vé trực tiếp tại quầy, hành khách vui lòng xuất trình thẻ học sinh, thẻ sinh viên chính chủ hoặc giấy báo nhập học đối với tân sinh viên.
  2. Khi đặt vé online qua App/Website, hành khách chọn mục "Ưu đãi sinh viên", chụp ảnh thẻ sinh viên tải lên hệ thống. Đội ngũ CSKH sẽ phê duyệt tự động trong vòng 10 phút.

VIAGO hi vọng chương trình này sẽ giảm bớt gánh nặng chi phí di chuyển cho các bạn học sinh, sinh viên và phụ huynh trong những ngày đầu tựu trường bận rộn.`
  },
  {
    id: 9,
    title: 'Thứ Tư vui vẻ: Săn vé đồng giá chỉ 199k trên toàn bộ các tuyến',
    category: 'Khuyến mãi',
    categoryKey: 'khuyen-mai',
    date: '08/09/2026',
    excerpt: 'Chương trình Flash Sale đặc biệt vào mỗi thứ Tư hàng tuần mang đến cơ hội trải nghiệm dòng xe cao cấp với mức giá cực sốc.',
    imageUrl: '/asset/images/customer/summer.jpg',
    contentBody: `Chào đón chuỗi ngày vàng ưu đãi giữa tuần, VIAGO khởi động chương trình "Thứ Tư vui vẻ - Săn vé đồng giá 199.000 VND". Đây là cơ hội tuyệt vời cho những ai đam mê du lịch tự túc hoặc có việc cần di chuyển khẩn cấp giữa các tỉnh thành lớn.

### Thể lệ chương trình:
* **Thời gian mở bán:** Duy nhất từ 08:00 đến 12:00 trưa ngày thứ Tư hàng tuần.
* **Giá vé áp dụng:** Đồng giá 199k cho vé xe Limousine tiêu chuẩn (Áp dụng cho các tuyến có khoảng cách dưới 350km).
* **Số lượng giới hạn:** Mỗi chuyến xe chỉ áp dụng tối đa 5 vé đồng giá, ưu tiên hành khách hoàn tất thanh toán sớm nhất trên App VIAGO.

Lên lịch hẹn giờ mỗi sáng thứ Tư để không bỏ lỡ những chiếc vé giá rẻ đặc biệt từ VIAGO và tận hưởng dịch vụ vận chuyển chuẩn 5 sao!`
  },
  {
    id: 10,
    title: 'Tri ân thành viên: Tặng voucher 100k cho khách hàng VIP đạt mốc 10 chuyến đi',
    category: 'Khuyến mãi',
    categoryKey: 'khuyen-mai',
    date: '20/09/2026',
    excerpt: 'Hệ thống tích lũy điểm thưởng VIAGO Club chính thức tung voucher tri ân đặc quyền cho khách hàng thân thiết.',
    imageUrl: '/asset/images/customer/summer.jpg',
    contentBody: `Thay lời cảm ơn chân thành gửi tới những khách hàng đã luôn tin tưởng và đồng hành cùng VIAGO trên mọi hành trình di chuyển, chúng tôi triển khai chương trình tặng thưởng đặc biệt dành riêng cho hội viên của VIAGO Club.

### Quyền lợi tích lũy và voucher quà tặng:
1. **Tặng ngay Voucher 100.000 VND:** Dành cho tài khoản hội viên tích lũy đủ 10 chuyến đi hoàn thành trong vòng 6 tháng kể từ ngày đăng ký thành viên.
2. **Quy đổi điểm thưởng linh hoạt:** Điểm tích lũy sau mỗi chuyến đi có thể đổi trực tiếp thành các phần quà hấp dẫn như: gối cổ chữ U cao cấp, bình giữ nhiệt VIAGO, hoặc giảm trừ trực tiếp vào giá vé cho lần đặt tiếp theo.
3. **Đặc quyền ưu tiên:** Hội viên hạng Kim Cương và Vàng được ưu tiên giữ chỗ trước 48 tiếng không cần thanh toán đặt cọc, miễn phí chọn chỗ ngồi mong muốn.

Đăng ký gia nhập VIAGO Club ngay hôm nay trên website để bắt đầu tích lũy điểm thưởng và nhận các ưu đãi độc quyền hấp dẫn.`
  },

  // ================= TAB 3: SỰ KIỆN (su-kien) =================
  {
    id: 11,
    title: 'Lễ kỷ niệm 5 năm thành lập hãng xe VIAGO',
    category: 'Sự kiện',
    categoryKey: 'su-kien',
    date: '15/06/2026',
    excerpt: 'VIAGO long trọng tổ chức lễ kỷ niệm 5 năm đồng hành và phát triển cùng hàng triệu chuyến đi an toàn trên khắp các tỉnh thành Việt Nam.',
    imageUrl: '/asset/images/customer/cho_noi.jpg',
    contentBody: `Chặng đường 5 năm không dài nhưng đủ để VIAGO khẳng định vị thế và xây dựng lòng tin vững chắc trong tâm trí của hàng triệu hành khách. Lễ kỷ niệm 5 năm thành lập được tổ chức tại Trung tâm Hội nghị TP.HCM với sự góp mặt của toàn thể ban lãnh đạo, cán bộ công nhân viên cùng các đối tác chiến lược.

Trong sự kiện này, đại diện công ty đã bày tỏ sự tri ân chân thành tới tất cả những khách hàng luôn lựa chọn đồng hành cùng hãng xe trong suốt thời gian qua, đồng thời cam kết sẽ tiếp tục nâng cao tiêu chuẩn dịch vụ, đảm bảo an toàn tuyệt đối trên mọi cung đường.

Nhìn lại chặng đường 5 năm qua, VIAGO tự hào đã phục vụ hơn 5 triệu lượt khách, phát triển mạng lưới hơn 50 chi nhánh/văn phòng trên toàn quốc và sở hữu hạm đội hơn 300 xe Limousine VIP giường nằm cao cấp. Ban giám đốc cũng công bố tầm nhìn chiến lược 5 năm tới, đặt mục tiêu phủ sóng dịch vụ vận chuyển hành khách đến 63 tỉnh thành Việt Nam và số hóa hoàn toàn quy trình vận hành dịch vụ.`
  },
  {
    id: 12,
    title: 'Đồng hành cùng Chương trình Mùa Hè Xanh 2026',
    category: 'Sự kiện',
    categoryKey: 'su-kien',
    date: '05/07/2026',
    excerpt: 'Nhà xe VIAGO tài trợ 100% vé xe đi lại cho các chiến sĩ tình nguyện trường Đại học Bách Khoa tham gia chiến dịch mùa hè xanh tại các tỉnh vùng sâu.',
    imageUrl: '/asset/images/customer/da_nang.jpg',
    contentBody: `Phát huy tinh thần tương thân tương ái và trách nhiệm xã hội của doanh nghiệp, năm nay VIAGO tiếp tục đồng hành cùng Đoàn thanh niên - Hội sinh viên trường Đại học Bách Khoa trong chiến dịch Mùa hè xanh đầy ý nghĩa.

Chúng tôi hân hạnh hỗ trợ toàn bộ xe Limousine đưa đón các chiến sĩ tình nguyện đến các địa điểm khó khăn tại vùng sâu, vùng xa thuộc các tỉnh Tây Nguyên để thực hiện công tác xây cầu nông thôn, dạy học và hỗ trợ bà con nghèo.

Chương trình tài trợ bao gồm:
* **Hỗ trợ 100% vé xe khứ hồi** cho hơn 250 chiến sĩ tình nguyện di chuyển từ TP.HCM đến các huyện nghèo thuộc tỉnh Đắk Lắk và Gia Lai.
* **Tài trợ 50 phần quà nhu yếu phẩm** (gồm gạo, sữa, tập vở học sinh) trị giá 30 triệu đồng để gửi tặng cho các hộ gia đình chính sách và trẻ em nghèo hiếu học tại địa phương.
* **Đồng hành kỹ thuật:** Các chuyến xe vận chuyển chiến sĩ luôn có đội ngũ lái xe giàu kinh nghiệm nhất của VIAGO điều khiển để đảm bảo an toàn tuyệt đối khi di chuyển qua các cung đường đèo dốc phức tạp vùng Tây Nguyên.`
  },
  {
    id: 13,
    title: 'Lễ bàn giao 50 xe Limousine giường nằm thế hệ mới từ nhà máy Thaco',
    category: 'Sự kiện',
    categoryKey: 'su-kien',
    date: '28/07/2026',
    excerpt: 'Sự kiện bàn giao dòng xe thế hệ mới đánh dấu bước tiến lớn của VIAGO trong việc trẻ hóa đội xe và nâng cao chất lượng dịch vụ vận chuyển.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Sáng ngày 28/07/2026, tại Khu phức hợp cơ khí ô tô Chu Lai - Trường Hải (Quảng Nam), đã diễn ra Lễ bàn giao lô 50 xe khách giường nằm cao cấp dòng THACO Mobihome Premium thế hệ mới cho Công ty Vận tải VIAGO.

Đây là một phần trong kế hoạch đầu tư chiến lược trị giá hơn 150 tỷ đồng của VIAGO trong năm 2026 nhằm thay thế hoàn toàn các xe cũ, chuẩn hóa 100% đội ngũ xe vận hành trên đường bằng xe chất lượng cao thế hệ mới nhất.

### Điểm nổi bật của xe giường nằm thế hệ mới bàn giao:
1. **Động cơ thế hệ mới xanh sạch:** Sử dụng động cơ đạt tiêu chuẩn khí thải Euro 5 thân thiện với môi trường, tiết kiệm 15% nhiên liệu tiêu thụ và vận hành êm ái hơn 30%.
2. **Khung gầm monocoque chịu lực:** Thiết kế khung gầm liền khối giúp tăng độ cứng cáp của thân xe, hấp thụ chấn động từ mặt đường hiệu quả, mang lại sự êm dịu tối đa cho hành khách trong suốt chuyến đi.
3. **Trang bị hộp số tự động:** Hỗ trợ tài xế thao tác mượt mà khi qua các khúc cua đèo dốc hiểm trở.`
  },
  {
    id: 14,
    title: 'VIAGO vinh dự nhận giải thưởng "Hãng xe khách được yêu thích nhất năm 2026"',
    category: 'Sự kiện',
    categoryKey: 'su-kien',
    date: '10/08/2026',
    excerpt: 'Tại lễ trao giải Du lịch Việt Nam Awards, VIAGO tự hào được vinh danh ở hạng mục giải thưởng dịch vụ vận chuyển hành khách xuất sắc nhất.',
    imageUrl: '/asset/images/customer/cho_noi.jpg',
    contentBody: `Được tổ chức thường niên bởi Tổng cục Du lịch Việt Nam, lễ trao giải Du lịch Việt Nam Awards 2026 là giải thưởng uy tín nhằm tôn vinh các doanh nghiệp có đóng góp xuất sắc cho sự phát triển của ngành du lịch và dịch vụ nước nhà.

Vượt qua nhiều tên tuổi lớn trong ngành vận tải, VIAGO đã đạt số điểm bình chọn cao nhất từ hội đồng chuyên môn và người tiêu dùng để giành danh hiệu danh giá "Hãng xe khách có dịch vụ chất lượng được yêu thích nhất năm 2026".

### Tiêu chí đánh giá giúp VIAGO đạt cúp vàng:
* **Tỷ lệ đúng giờ đạt 99.2%:** Đảm bảo xuất bến đúng lịch trình cam kết bất kể điều kiện thời tiết.
* **Đội ngũ tài xế thân thiện:** Tài xế và tiếp viên đạt đánh giá trung bình 4.8/5 sao từ ứng dụng khách hàng.
* **Không nhồi nhét khách:** Nghiêm túc thực hiện bán đúng số ghế thiết kế trên xe.`
  },
  {
    id: 15,
    title: 'Giải chạy Marathon nội bộ "VIAGO Run - Kết nối những nẻo đường" quyên góp quỹ từ thiện',
    category: 'Sự kiện',
    categoryKey: 'su-kien',
    date: '25/09/2026',
    excerpt: 'Hơn 500 cán bộ công nhân viên VIAGO tham gia ngày hội chạy bộ nhằm gây quỹ xây dựng nhà tình thương cho đồng bào miền Trung.',
    imageUrl: '/asset/images/customer/da_nang.jpg',
    contentBody: `Nhằm khuyến khích tinh thần rèn luyện thể thao nâng cao sức khỏe và thắt chặt tình đoàn kết nội bộ, Công đoàn VIAGO đã tổ chức thành công giải chạy Marathon mang tên "VIAGO Run - Kết nối những nẻo đường".

Sự kiện diễn ra tại khu đô thị Phú Mỹ Hưng (Quận 7, TP.HCM) quy tụ đông đảo ban lãnh đạo cùng tập thể nhân viên văn phòng, thợ sửa chữa gara và các bác tài từ mọi miền Tổ quốc tụ hội về tham gia tranh tài ở cự ly 5km, 10km và 21km.

Đặc biệt, với mỗi kilomet chạy hoàn thành của vận động viên, ban tổ chức trích 10.000 VND từ ngân quỹ công ty để ủng hộ vào Quỹ Xây nhà tình thương VIAGO Care. Kết thúc ngày hội chạy bộ, tổng số tiền quyên góp được là 120 triệu đồng, sẽ được chuyển trực tiếp để xây dựng 2 căn nhà tình thương cho gia đình khó khăn tại tỉnh Quảng Nam.`
  },

  // ================= TAB 4: TIN NHÀ XE (tin-nha-xe) =================
  {
    id: 16,
    title: 'VIAGO Chính Thức Vận Hành Dòng Xe THACO Mobihome 22 Phòng Premium Cao Cấp',
    category: 'Tin nhà xe',
    categoryKey: 'tin-nha-xe',
    date: '24/05/2026',
    excerpt: 'Đánh dấu bước chuyển mình, VIAGO tự hào đưa vào phục vụ hành khách dòng xe chuyên cơ mặt đất đẳng cấp và an toàn nhất hiện nay.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Dòng xe THACO Mobihome 22 Phòng Premium được trang bị hệ thống giảm chấn thủy lực cao cấp cùng các tính năng an toàn tối tân như phanh ABS, phanh từ tự động chống trượt. Nội thất xe được bọc da cao cấp, kết hợp massage đa điểm độc lập cho mỗi khoang nằm.

Mỗi phòng nằm được thiết kế như một cabin hạng sang khép kín có rèm che bảo vệ quyền riêng tư, đem lại trải nghiệm di chuyển êm ái như phòng ngủ khách sạn di động trên mọi chặng đường xa.

### Các thông số kỹ thuật và tiện nghi cao cấp:
1. **Thiết kế Cabin Độc lập:** 22 khoang cabin được tối ưu hóa diện tích sử dụng. Lớp cách âm cao cấp ngăn cách khoang máy và tiếng gió, đảm bảo giấc ngủ trọn vẹn của khách hàng.
2. **Hệ thống Massage Khí nén:** Tích hợp trực tiếp vào tựa lưng ghế nằm thương gia. Hành khách có thể tùy chỉnh 5 chế độ massage khác nhau từ nhẹ nhàng đến chuyên sâu bằng bảng điều khiển cảm ứng.
3. **Màn hình Giải trí Thông minh:** Trang bị màn hình HD cảm ứng lớn tại mỗi cabin, tích hợp cổng kết nối tai nghe 3.5mm, cổng sạc nhanh USB Type-C cho các thiết bị điện tử cầm tay.
4. **Hệ thống Đèn LED Đọc sách và Đèn Ngủ:** Có chế độ tùy biến cường độ sáng và màu sắc ánh sáng giúp không gian cabin trở nên ấm cúng, thư giãn, không gây mỏi mắt.`
  },
  {
    id: 17,
    title: 'Mở Rộng Lộ Trình Đón Trả Khách Tận Nơi Tại Khu Vực Bến Xe Bến Cát (Bình Dương)',
    category: 'Tin nhà xe',
    categoryKey: 'tin-nha-xe',
    date: '24/05/2026',
    excerpt: 'Tin vui cho bà con Bình Dương đang sinh sống và làm việc tại khu vực Bến Cát: VIAGO mở rộng dịch vụ xe trung chuyển đón trả khách miễn phí tận nơi.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Đáp ứng nguyện vọng của đông đảo hành khách tại Bình Dương, kể từ ngày 01/06/2026, nhà xe VIAGO triển khai mở rộng phạm vi đón trả khách miễn phí bằng xe trung chuyển trong bán kính lên đến 15km tính từ khu vực Bến xe Bến Cát.

Hành khách chỉ cần đăng ký điểm đón khi đặt vé qua tổng đài hoặc website của hãng, xe trung chuyển chuyên nghiệp sẽ đón bạn tận cửa nhà vô cùng tiện lợi và hoàn toàn miễn phí.

### Phạm vi áp dụng đón trả trung chuyển cụ thể:
* **Các phường nội ô:** Mỹ Phước, Thới Hòa, Hòa Lợi, Chánh Phú Hòa, Tân Định thuộc thị xã Bến Cát.
* **Các khu công nghiệp (KCN):** KCN Mỹ Phước 1, 2, 3, KCN Rạch Bắp, KCN Việt Hương 2.
* **Yêu cầu đối với hành khách:** Vui lòng chuẩn bị sẵn hành lý và có mặt tại điểm đón trước 30 phút so với giờ xe trung chuyển thông báo để đảm bảo xe chạy đúng giờ hành trình đường dài.`
  },
  {
    id: 18,
    title: 'VIAGO trang bị hệ thống lọc không khí chuẩn y khoa trên toàn bộ đoàn xe limousine',
    category: 'Tin nhà xe',
    categoryKey: 'tin-nha-xe',
    date: '05/09/2026',
    excerpt: 'Bảo vệ sức khỏe hành khách tối đa, VIAGO lắp đặt máy lọc khí ion âm cùng màng lọc HEPA nhập khẩu trực tiếp từ Nhật Bản trên tất cả các cabin xe khách.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Nhằm mang lại bầu không khí trong sạch và an toàn tuyệt đối cho khách hàng suốt hành trình dài hàng tiếng đồng hồ, VIAGO chính thức hoàn tất việc nâng cấp và lắp đặt hệ thống lọc không khí thông minh chuẩn y khoa trên 100% dòng xe Limousine giường nằm VIP của hãng.

### Lợi ích vượt trội từ màng lọc HEPA cao cấp:
1. **Loại bỏ 99.9% bụi mịn PM2.5:** Lọc sạch bụi siêu nhỏ lơ lửng trong không khí, khí thải động cơ xâm nhập từ bên ngoài vào.
2. **Khử sạch mùi hôi và nấm mốc:** Loại bỏ hoàn toàn mùi thức ăn, mùi ghế da hay ẩm mốc khó chịu - những nguyên nhân chính gây ra cảm giác buồn nôn, say xe cho hành khách.
3. **Tiêu diệt vi khuẩn và virus:** Hệ thống đèn UV diệt khuẩn tích hợp trong ống gió điều hòa giúp lọc sạch các tác nhân gây bệnh hô hấp lây lan chéo trong không gian xe khép kín.

Đây là sự đầu tư mang tính dài hạn thể hiện sự quan tâm chu đáo của VIAGO tới từng chi tiết trải nghiệm nhỏ nhất của quý hành khách trên mỗi chuyến xe.`
  },
  {
    id: 19,
    title: 'Hoàn tất khóa đào tạo kỹ năng sơ cấp cứu và ứng xử văn minh cho 100% tiếp viên xe',
    category: 'Tin nhà xe',
    categoryKey: 'tin-nha-xe',
    date: '18/09/2026',
    excerpt: 'Hợp tác cùng Hội Chữ Thập Đỏ, VIAGO nâng cao năng lực sơ cứu y tế và văn hóa phục vụ hành khách cho đội ngũ nhân viên hiện trường.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Trong tháng 9/2026, VIAGO đã phối hợp với các chuyên gia y tế hàng đầu từ Hội Chữ thập đỏ Việt Nam tổ chức khóa đào tạo chuyên sâu về "Sơ cấp cứu cơ bản và Kỹ năng giao tiếp ứng xử văn minh trên xe khách" dành cho toàn bộ nhân viên phục vụ, tiếp viên xe và lái xe trên toàn quốc.

### Nội dung khóa đào tạo bao gồm:
* **Kỹ năng xử lý tình huống y tế khẩn cấp:** Xử lý các sự cố ngất xỉu, tụt huyết áp, co giật, dị vật đường thở hoặc chấn thương nhẹ phát sinh đột xuất trong quá trình xe di chuyển trên đường cao tốc.
* **Kỹ năng chăm sóc khách hàng đặc biệt:** Cách đón tiếp và hỗ trợ hành khách là phụ nữ mang thai, trẻ sơ sinh, người khuyết tật di chuyển lên xuống xe an toàn.
* **Thực hành giao tiếp tiếng Anh cơ bản:** Hỗ trợ phục vụ đối tượng khách du lịch nước ngoài đặt vé và hỏi đáp thông tin điểm đến.

Kết thúc khóa học, tất cả học viên đã vượt qua bài kiểm tra lý thuyết - thực hành khắt khe và được cấp chứng chỉ sơ cứu y tế chính thức, mang lại sự an tâm tuyệt đối cho khách hàng đi xe VIAGO.`
  },
  {
    id: 20,
    title: 'VIAGO ra mắt kênh hotline hỗ trợ khẩn cấp 24/7 giải quyết khiếu nại của khách hàng',
    category: 'Tin nhà xe',
    categoryKey: 'tin-nha-xe',
    date: '01/10/2026',
    excerpt: 'Cam kết giải quyết mọi phản ánh dịch vụ của hành khách trong tối đa 12 giờ làm việc qua đầu số hotline chăm sóc khách hàng mới.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Với phương châm đặt quyền lợi khách hàng lên hàng đầu, VIAGO chính thức vận hành Tổng đài Chăm sóc khách hàng và tiếp nhận phản ánh dịch vụ khẩn cấp qua đầu số mới 1900 1234 từ tháng 10/2026.

### Cơ chế hoạt động của Hotline mới:
1. **Kết nối trực tiếp 24/7:** Phục vụ liên tục kể cả ngày nghỉ lễ, Tết hay lúc đêm khuya khi các chuyến xe giường nằm đang chạy trên đường.
2. **Cam kết thời gian xử lý nhanh chóng:** Mọi phản ánh về thái độ của lái xe, giá vé sai lệch hay vấn đề thất lạc đồ đạc sẽ được ghi nhận và chuyển tiếp lên ban thanh tra xử lý. Kết quả phản hồi chính thức sẽ gửi tới khách hàng qua SMS/Email trong vòng tối đa 12 giờ.
3. **Lưu trữ ghi âm cuộc gọi:** Đảm bảo tính minh bạch, khách quan trong quá trình đối chất, bảo vệ tối đa quyền lợi chính đáng của người tiêu dùng.`
  },

  // ================= TAB 5: CẨM NANG DI CHUYỂN (cam-nang) =================
  {
    id: 21,
    title: 'Kinh nghiệm đi du lịch Đà Lạt bằng xe Limousine từ A đến Z',
    category: 'Cẩm nang di chuyển',
    categoryKey: 'cam-nang',
    date: '10/05/2026',
    excerpt: 'Tổng hợp chi tiết kinh nghiệm đặt vé xe limousine đi Đà Lạt cực kỳ hữu ích, giúp chuyến đi tránh say xe và nghỉ ngơi thoải mái nhất.',
    imageUrl: '/asset/images/customer/quang_truong_lam_vien_da_lat.jpg',
    contentBody: `Đà Lạt luôn là điểm đến hấp dẫn quanh năm. Việc lựa chọn di chuyển bằng dòng xe Limousine giường nằm chất lượng cao của VIAGO sẽ giúp bạn giữ gìn sức khỏe tối đa để khám phá thành phố ngàn hoa trọn vẹn nhất.

Khi đi xe limousine đi Đà Lạt, kinh nghiệm hàng đầu là bạn nên đặt vé trước từ 1 đến 2 tuần nếu đi vào dịp cuối tuần, chọn những cabin ở tầng dưới and giữa thân xe để tránh xóc nảy, và đừng quên tận dụng hệ thống massage tự động được trang bị trên xe để có giấc ngủ thật ngon lành qua đêm.

### Những lưu ý bỏ túi khi đi du lịch Đà Lạt:
1. **Thời điểm khởi hành lý tưởng:** Nên chọn các chuyến xe đêm xuất phát lúc 22:00 hoặc 23:00 từ Sài Gòn. Bạn sẽ được ngủ nguyên một giấc trên xe phòng VIAGO ấm áp và đặt chân tới Đà Lạt lúc 05:00 sáng - thời gian lý tưởng để săn mây và tận hưởng không khí se lạnh buổi sớm.
2. **Lựa chọn giường nằm:** Nếu bạn hay say xe, hãy ưu tiên chọn giường tầng dưới (các phòng từ số 1 đến số 10) vì tầng dưới thăng bằng tốt hơn, ít bị nghiêng lắc khi đi qua cung đèo Bảo Lộc khúc khuỷu.
3. **Giữ ấm cơ thể:** Nhiệt độ Đà Lạt về đêm và sáng sớm dao động từ 14-16 độ C. Dù trên xe Limousine VIAGO luôn chuẩn bị sẵn chăn đắp thơm tho và điều hòa ấm, bạn vẫn nên chuẩn bị sẵn áo khoác len ấm, tất chân trong hành lý xách tay để mặc ngay khi bước xuống xe.`
  },
  {
    id: 22,
    title: 'Những vật dụng không thể thiếu khi đi xe khách đường dài',
    category: 'Cẩm nang di chuyển',
    categoryKey: 'cam-nang',
    date: '12/05/2026',
    excerpt: 'Để có một chuyến xe đường dài thật trọn vẹn và an tâm, bạn nên chuẩn bị những vật dụng cá nhân nhỏ gọn nhưng vô cùng tiện lợi sau.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Chuyến xe đường dài hàng trăm cây số sẽ trở nên dễ dàng và thư giãn hơn nhiều nếu bạn bỏ túi một vài vật dụng cá nhân nhỏ xinh như: gối chữ U kê cổ êm ái, tai nghe chống ồn, một chiếc chăn mỏng nhẹ và bình nước giữ nhiệt cá nhân.

Tại VIAGO, chúng tôi cung cấp đầy đủ nước lọc đóng chai và cổng sạc USB, tuy nhiên chuẩn bị thêm các món đồ riêng yêu thích sẽ giúp hành trình của bạn mang đậm dấu ấn cá nhân và tiện lợi hơn.

### Gợi ý danh sách vật dụng cần mang theo:
* **Gối cổ chữ U:** Giúp cố định phần đầu, giảm cảm giác mỏi vai gáy khi bạn nằm đọc sách hoặc xem phim giải trí ở tư thế nghiêng.
* **Tai nghe chống ồn:** Dù xe VIAGO vận hành vô cùng êm ái, một chiếc tai nghe chất lượng sẽ giúp bạn chìm vào không gian âm nhạc thư giãn riêng tư tuyệt đối mà không bị ảnh hưởng bởi tiếng ồn xung quanh.
* **Bình giữ nhiệt nhỏ:** Chứa nước ấm hoặc trà gừng giúp giữ ấm cổ họng trong suốt chuyến đi máy lạnh, đặc biệt hữu ích cho người già và trẻ em.`
  },
  {
    id: 23,
    title: 'Top 5 địa điểm check-in cực đẹp không thể bỏ qua khi đến Hạ Long bằng xe VIAGO',
    category: 'Cẩm nang di chuyển',
    categoryKey: 'cam-nang',
    date: '02/06/2026',
    excerpt: 'Khám phá ngay danh sách 5 kỳ quan thiên nhiên, khu vui chơi nổi tiếng tại Hạ Long phù hợp cho chuyến nghỉ dưỡng cuối tuần của bạn.',
    imageUrl: '/asset/images/customer/nha_trang.jpg',
    contentBody: `Hạ Long là một trong những điểm du lịch hot nhất miền Bắc với nhiều bãi biển đẹp và danh lam thắng cảnh độc đáo. Hãy lưu ngay danh sách các địa điểm check-in cực đỉnh dưới đây để có một chuyến đi trọn vẹn nhất sau hành trình di chuyển thoải mái bằng xe limousine VIAGO.

### 5 địa điểm thu hút du khách hàng đầu:
1. **Vịnh Hạ Long:** Trải nghiệm đi du thuyền khám phá hang Sửng Sốt, hang Đầu Gỗ hay chèo thuyền kayak xung quanh đảo Titop hoang sơ.
2. **Khu đồi huyền bí Sun World:** Ngắm nhìn toàn cảnh thành phố và Vịnh Hạ Long từ vòng quay mặt trời Sun Wheel khổng lồ vào ban đêm.
3. **Phố cổ Bãi Cháy:** Tuyến phố đi bộ mang đậm phong cách kiến trúc Nhật Bản và phố cổ Hội An thu nhỏ, cực kỳ lung linh khi lên đèn.
4. **Bảo tàng Quảng Ninh:** Công trình kiến trúc phủ kính đen độc đáo mang tính biểu tượng của thành phố Hạ Long, góc chụp ảnh sống ảo ưa thích của giới trẻ.
5. **Núi Bài Thơ:** Địa điểm lý tưởng để leo núi thể thao dã ngoại và đón bình minh hùng vĩ trên vịnh xanh từ trên cao.`
  },
  {
    id: 24,
    title: 'Mẹo đặt vé xe lễ Tết không lo bị hết chỗ hoặc đội giá vé',
    category: 'Cẩm nang di chuyển',
    categoryKey: 'cam-nang',
    date: '14/06/2026',
    excerpt: 'Làm thế nào để tránh tình trạng cháy vé xe khách đường dài mỗi dịp cao điểm lễ Tết? Hãy bỏ túi các kinh nghiệm quý giá dưới đây.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Nhu cầu di chuyển về quê hoặc đi du lịch trong các ngày nghỉ lễ lớn của cả nước luôn tăng vọt khiến hệ thống phòng vé luôn quá tải. Dưới đây là những cẩm nang bỏ túi từ nhà xe VIAGO giúp bạn luôn sở hữu chiếc vé xe đúng giá và ưng ý nhất.

### Các bước chuẩn bị thông minh:
* **Đặt vé sớm từ 1 - 2 tháng:** Đa số các nhà xe uy tín như VIAGO đều có chính sách mở bán vé Tết sớm trước từ 2 đến 3 tháng. Bạn nên lên lịch trình cá nhân sớm và tiến hành đặt vé ngay, tránh tâm lý chờ đợi sát ngày mới mua.
* **Sử dụng ứng dụng chính thống:** Đặt trực tiếp qua App VIAGO hoặc Website chính thức của hãng. Hạn chế mua qua các trang trung gian mập mờ thông tin hoặc hội nhóm thanh lý vé trôi nổi trên mạng xã hội dễ dính bẫy lừa đảo.
* **Thanh toán ngay để giữ chỗ:** Hoàn tất chuyển khoản thanh toán trực tuyến ngay khi đặt chỗ để hệ thống gửi mã vé QR điện tử về điện thoại. Điều này đảm bảo giao dịch giữ ghế đã thành công 100%.`
  },
  {
    id: 25,
    title: 'Cách phòng tránh say xe hiệu quả cho trẻ em và người lớn tuổi trên hành trình xa',
    category: 'Cẩm nang di chuyển',
    categoryKey: 'cam-nang',
    date: '28/06/2026',
    excerpt: 'Những bí quyết y tế và mẹo nhỏ dân gian đơn giản giúp giảm thiểu tối đa triệu chứng say xe, mang lại chuyến đi khỏe khoắn.',
    imageUrl: '/asset/images/customer/quang_truong_lam_vien_da_lat.jpg',
    contentBody: `Say xe luôn là nỗi ám ảnh lớn của nhiều người, đặc biệt là người già, trẻ nhỏ khi phải di chuyển bằng ô tô đường dài hàng trăm cây số. VIAGO mách bạn một số cách tự nhiên vô cùng hữu hiệu để đẩy lùi cảm giác mệt mỏi này.

### Những phương pháp đẩy lùi say xe hiệu quả:
1. **Lựa chọn vị trí nằm phù hợp:** Nên ưu tiên chọn vị trí khoang cabin ở khu vực giữa xe, tầng dưới (phòng số 5 đến số 12). Đây là nơi xe thăng bằng tốt nhất, ít bị lực ly tâm tác động khi vào cua hay phanh gấp.
2. **Sử dụng gừng tươi hoặc vỏ quýt:** Hương thơm tinh dầu tự nhiên từ vỏ cam, vỏ quýt tươi hoặc một vài lát gừng ngậm trong miệng giúp kích thích hệ thần kinh trung ương, lấn át cảm giác buồn nôn rất tốt.
3. **Uống thuốc say xe đúng cách:** Đối với người nhạy cảm, nên uống thuốc chống say xe trước giờ xuất bến 30 phút để thuốc có thời gian ngấm và phát huy tác dụng tốt nhất.`
  },

  // ================= TAB 6: TUYỂN DỤNG (tuyen-dung) =================
  {
    id: 26,
    title: 'Tuyển dụng Tài xế hạng D, E làm việc tại khu vực TP.HCM',
    category: 'Tuyển dụng',
    categoryKey: 'tuyen-dung',
    date: '20/05/2026',
    excerpt: 'VIAGO cần tuyển thêm 10 lái xe chuyên nghiệp bằng D, E trở lên, nhiều kinh nghiệm chạy tuyến đường dài Bắc Nam để mở rộng quy mô vận tải.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Nhằm đáp ứng chiến lược mở rộng thêm nhiều tuyến xe liên tỉnh mới kết nối từ khu vực miền Nam đi các tỉnh miền Trung và Tây Nguyên, VIAGO hân hoan chào đón các tài xế có tay nghề cao gia nhập đại gia đình của chúng tôi.

Yêu cầu ứng viên có bằng lái xe hạng D hoặc E trở lên, có ít nhất 3 năm kinh nghiệm chạy xe đường dài, thái độ phục vụ khách hàng lịch sự, nhã nhặn. Thu nhập cam kết ổn định cùng nhiều chính sách đãi ngộ, bảo hiểm vô cùng hấp dẫn.

### Quyền lợi được hưởng:
* **Mức lương hấp dẫn:** Thu nhập từ 15,000,000 đến 22,000,000 VND / tháng tùy theo chặng tuyến.
* **Phụ cấp hành trình đầy đủ:** Hỗ trợ chi phí ăn uống dọc đường, phòng nghỉ ngơi đầy đủ tiện nghi tại các đầu văn phòng bến xe.
* **Chính sách bảo hiểm:** Đóng đầy đủ BHXH, BHYT, BHTN và gói bảo hiểm tai nạn lái xe đặc biệt 24/7 của Bảo Việt.`
  },
  {
    id: 27,
    title: 'Tuyển nhân viên bán vé và hỗ trợ khách hàng tại văn phòng Đà Nẵng',
    category: 'Tuyển dụng',
    categoryKey: 'tuyen-dung',
    date: '22/05/2026',
    excerpt: 'Môi trường làm việc năng động, chế độ đãi ngộ hấp dẫn. VIAGO chào mừng các bạn trẻ yêu thích ngành dịch vụ khách hàng gia nhập đội ngũ.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Với phương châm phát triển con người là cốt lõi của chất lượng dịch vụ, văn phòng VIAGO chi nhánh Đà Nẵng thông báo tuyển dụng 5 nhân viên giao dịch phòng vé và hỗ trợ hành khách.

Công việc bao gồm hướng dẫn đặt vé, đón tiếp khách tại văn phòng, xử lý thông tin hành lý và giải đáp các câu hỏi của khách hàng. Chúng tôi ưu tiên các ứng viên giao tiếp tốt, nhanh nhẹn và mong muốn gắn bó lâu dài cùng sự phát triển của công ty.

### Yêu cầu ứng viên tuyển dụng:
* Tốt nghiệp Trung cấp trở lên, giọng nói dễ nghe, không nói ngọng, nói lắp hoặc nói giọng địa phương quá nặng.
* Sử dụng máy vi tính văn phòng cơ bản thành thạo (để thực hiện thao tác chọn ghế và in vé trên phần mềm quản lý nội bộ của VIAGO).
* Có tinh thần trách nhiệm, cởi mở, thân thiện và sẵn sàng hỗ trợ giúp đỡ hành khách, đặc biệt là người già và trẻ em khi tới văn phòng bến xe chờ khởi hành.`
  },
  {
    id: 28,
    title: 'Tuyển nhân viên tổng đài chăm sóc khách hàng ca đêm làm việc tại Hà Nội',
    category: 'Tuyển dụng',
    categoryKey: 'tuyen-dung',
    date: '02/06/2026',
    excerpt: 'Tìm kiếm 3 điện thoại viên trực tổng đài tư vấn, giải đáp thắc mắc và xử lý đặt giữ chỗ của khách hàng ca tối/đêm.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Nhằm đảm bảo kênh hotline 1900 1234 luôn hoạt động liên tục 24/24 hỗ trợ tối đa cho hành khách đi các chuyến xe giường nằm đêm, VIAGO Hà Nội thông báo tuyển dụng bổ sung nhân sự trực tổng đài điện thoại.

### Mô tả công việc và thời gian làm việc:
* **Thời gian làm việc:** Ca đêm từ 22:00 tối đến 06:00 sáng hôm sau (Xoay ca linh hoạt theo tuần, nghỉ 1 ngày/tuần).
* **Mức lương ca đêm:** Từ 9,000,000 đến 12,000,000 VND / tháng (Đã bao gồm phụ cấp ca đêm 30% lương cơ bản).
* **Yêu cầu công việc:** Kỹ năng lắng nghe tốt, bình tĩnh xử lý khiếu nại của khách hàng, giọng nói nhẹ nhàng truyền cảm, chịu được áp lực công việc ban đêm.`
  },
  {
    id: 29,
    title: 'Tuyển dụng Chuyên viên Marketing mảng dịch vụ vận tải tại trụ sở chính TP.HCM',
    category: 'Tuyển dụng',
    categoryKey: 'tuyen-dung',
    date: '12/06/2026',
    excerpt: 'Lên kế hoạch quảng bá thương hiệu, tổ chức các chiến dịch khuyến mãi vé xe và quản lý các kênh thông tin truyền thông của VIAGO.',
    imageUrl: '/asset/images/customer/ben_xe.jpg',
    contentBody: `Để phục vụ cho các chiến dịch ra mắt dịch vụ mới và gia tăng mức độ nhận diện thương hiệu VIAGO trên thị trường vận tải hành khách toàn quốc, chúng tôi tìm kiếm 2 đồng nghiệp Marketing năng động gia nhập văn phòng TP.HCM.

### Nhiệm vụ công việc chính:
1. **Lập kế hoạch chiến dịch:** Thiết kế và triển khai các chương trình ưu đãi vé xe dịp Lễ, Tết, các sự kiện xã hội của hãng xe.
2. **Quản lý nội dung số:** Chăm sóc fanpage, quản lý các bài tin tức truyền thông, cẩm nang di chuyển trên website chính thức của VIAGO.
3. **Phân tích hiệu quả:** Theo dõi số lượng khách đặt vé qua website, app để đề xuất tối ưu hóa chuyển đổi trải nghiệm khách hàng.

Chào đón các bạn trẻ năng động, sáng tạo và có ít nhất 2 năm kinh nghiệm trong lĩnh vực Marketing dịch vụ du lịch, khách sạn hoặc vận tải ứng tuyển.`
  },
  {
    id: 30,
    title: 'Tuyển kỹ thuật viên sửa chữa bảo dưỡng xe ô tô khách làm việc tại Gara VIAGO Q.12',
    category: 'Tuyển dụng',
    categoryKey: 'tuyen-dung',
    date: '25/06/2026',
    excerpt: 'Thực hiện công tác bảo dưỡng định kỳ hệ thống máy móc, phanh gầm xe ô tô khách Limousine giường nằm lớn từ 9 đến 45 chỗ.',
    imageUrl: '/asset/images/customer/xe.jpg',
    contentBody: `Xưởng dịch vụ kỹ thuật bảo trì xe khách VIAGO tại Quận 12 (TP.HCM) cần tuyển dụng bổ sung 3 thợ máy gầm điện ô tô giàu kinh nghiệm để chăm sóc định kỳ cho đội ngũ hơn 300 xe limousine giường nằm cao cấp của hãng.

### Yêu cầu tay nghề và quyền lợi:
* **Yêu cầu chuyên môn:** Tốt nghiệp Trung cấp nghề Cơ khí động lực trở lên. Am hiểu cấu tạo động cơ diesel xe khách lớn THACO Mobihome, xe Ford Transit 9 chỗ. Có khả năng đọc lỗi máy bằng thiết bị quét điện tử thông minh.
* **Chính sách đãi ngộ:** Lương cứng từ 12,000,000 đến 18,000,000 VND / tháng phụ thuộc vào trình độ và thâm niên làm việc. Bao cơm trưa tại nhà ăn gara, phụ cấp độc hại đầy đủ. Có nhà tập thể cho kỹ thuật viên ở xa.`
  }
];
