import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatBotComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  isTyping = false;

  messages: Message[] = [
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào! Tôi là ViagoAI. Tôi có thể hỗ trợ gì cho bạn hôm nay?',
      timestamp: new Date()
    }
  ];

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: this.userInput,
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    const userText = this.userInput;
    this.userInput = '';
    this.scrollToBottom();

    // Trigger typing state
    this.isTyping = true;

    // Simulate AI response after 1 second
    setTimeout(() => {
      this.isTyping = false;
      const botReply = this.generateBotResponse(userText);
      this.messages.push({
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        timestamp: new Date()
      });
      this.scrollToBottom();
    }, 1000);
  }

  renderMessageText(text: string): SafeHtml {
    // Basic markdown link parser: [Text](Url)
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const htmlText = text.replace(regex, '<a href="$2">$1</a>');
    return this.sanitizer.bypassSecurityTrustHtml(htmlText);
  }

  handleLinkClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.tagName === 'A') {
      event.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        // Parse url and query parameters
        const urlParts = href.split('?');
        const path = urlParts[0];
        const queryParams: any = {};
        
        if (urlParts[1]) {
          const params = urlParts[1].split('&');
          params.forEach(p => {
            const pair = p.split('=');
            queryParams[pair[0]] = pair[1];
          });
        }
        
        this.router.navigate([path], { queryParams });
        this.isOpen = false;
      }
    }
  }

  private generateBotResponse(text: string): string {
    const lowercase = text.toLowerCase();

    if (lowercase.includes('vé') || lowercase.includes('dat ve') || lowercase.includes('đặt vé') || lowercase.includes('mua ve')) {
      return 'Để đặt vé xe VIAGO nhanh chóng, bạn có thể về [Trang chủ](/) sử dụng công cụ tìm kiếm chuyến xe ở trên cùng, chọn Điểm đi, Điểm đến và Ngày đi mong muốn nhé.';
    }
    
    if (lowercase.includes('lịch trình') || lowercase.includes('lich trinh') || lowercase.includes('tuyến') || lowercase.includes('tuyen')) {
      return 'Bạn có thể xem chi tiết thời gian khởi hành và lộ trình của các tuyến xe tại trang [Lịch trình](/lich-trinh).';
    }

    if (lowercase.includes('thất lạc') || lowercase.includes('mất đồ') || lowercase.includes('mat do') || lowercase.includes('nhận đồ')) {
      return 'Nếu bạn để quên hành lý trên xe, bạn vui lòng truy cập trang [Tìm đồ thất lạc](/dich-vu?tab=that-lac) để tra cứu danh sách đồ đã thu hồi hoặc gửi biểu mẫu khai báo nhé.';
    }

    if (lowercase.includes('thuê xe') || lowercase.includes('thue xe') || lowercase.includes('hợp đồng') || lowercase.includes('hop dong')) {
      return 'Dịch vụ thuê xe hợp đồng Limousine, Giường nằm cao cấp của chúng tôi có thể được tìm thấy và đăng ký báo giá tại trang [Thuê xe hợp đồng](/dich-vu?tab=thue-xe).';
    }

    if (lowercase.includes('đánh giá') || lowercase.includes('danh gia') || lowercase.includes('nhận xét') || lowercase.includes('nhan xet')) {
      return 'Mời bạn xem phản hồi từ những hành khách khác hoặc chia sẻ trải nghiệm chuyến đi của bạn tại trang [Đánh giá](/danh-gia).';
    }

    if (lowercase.includes('hóa đơn') || lowercase.includes('hoa don') || lowercase.includes('tra cứu')) {
      return 'Để tra cứu hóa đơn điện tử hoặc vé điện tử của chuyến đi, bạn vui lòng truy cập trang [Hóa đơn](/hoa-don).';
    }

    if (lowercase.includes('chào') || lowercase.includes('hello') || lowercase.includes('hi') || lowercase.includes('cần hỗ trợ')) {
      return 'Xin chào! Tôi có thể hỗ trợ bạn tìm kiếm lịch trình, thông tin đặt vé, thuê xe hợp đồng hoặc tìm hành lý thất lạc. Bạn cần giúp gì ạ?';
    }

    return 'Cảm ơn bạn đã nhắn tin cho ViagoAI. Tôi có thể hỗ trợ bạn tìm thông tin đặt vé, lịch trình, hóa đơn, đánh giá hoặc báo nhận đồ thất lạc. Bạn có thể cho tôi biết rõ nhu cầu hơn được không ạ?';
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
