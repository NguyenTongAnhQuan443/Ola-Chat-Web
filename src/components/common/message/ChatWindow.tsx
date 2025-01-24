export function ChatWindow() {
    return (
      <div className="d-flex flex-column h-100">
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Chat Avatar"
              className="rounded-circle me-3"
              width={40}
              height={40}
            />
            <div>
              <h6 className="mb-0">Bessie</h6>
              <small className="text-muted">Marketing Manager</small>
            </div>
          </div>
        </div>
  
        <div className="flex-grow-1 overflow-auto p-3" style={{ height: "calc(100vh - 240px)" }}>
          <div className="d-flex flex-column gap-3">
            <div className="align-self-start" style={{ maxWidth: "75%" }}>
              <div className="message-bubble received">
                <p className="mb-1">
                  Hi, Robert. I'm facing some challenges in optimizing my code for performance. Can you help?
                </p>
                <small className="text-muted">12:45 PM</small>
              </div>
            </div>
  
            <div className="align-self-end" style={{ maxWidth: "75%" }}>
              <div className="message-bubble sent">
                <p className="mb-1">
                  Hi, Bessie 👋 I'd be glad to help you with optimizing your code for better performance. To get started,
                  could you provide me with some more details about the specific challenges you're facing?
                </p>
                <small className="opacity-75">12:55 PM</small>
              </div>
            </div>
          </div>
        </div>
  
        <div className="p-3 border-top">
          <form className="d-flex gap-2">
            <input type="text" className="form-control rounded-pill" placeholder="Type your message..." />
            <button
              type="submit"
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  