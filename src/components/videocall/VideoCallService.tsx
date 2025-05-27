// Service để quản lý các cuộc gọi video
class VideoCallService {
  // Tạo ID kênh duy nhất cho một cuộc gọi
  generateChannelId(conversationId: string, timestamp = Date.now()): string {
    // Tạo một channel ID dựa trên conversationId và timestamp
    return `${conversationId}-${timestamp}`;
  }
  
  // Mở một cuộc gọi mới trong tab mới
  openVideoCall(channelId: string, partnerId: string, partnerName: string): void {
    const url = `/video-call/${channelId}/${partnerId}/${encodeURIComponent(partnerName)}`;
    window.open(url, '_blank');
  }
  
  // Có thể thêm các phương thức khác như lưu lịch sử cuộc gọi, v.v.
}

export const videoCallService = new VideoCallService();
export default videoCallService;