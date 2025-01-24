import { ChatList } from "../components/common/message/ChatList";
import { ChatWindow } from "../components/common/message/ChatWindow";
import { Layout } from "../components/layout/Layout";

export default function ChatPage() {
  return (
    <Layout>
      <div className="d-flex h-100">
        <ChatList />
        <ChatWindow />
      </div>
    </Layout>
  )
}