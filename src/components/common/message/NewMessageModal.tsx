interface Person {
    id: number
    name: string
    title: string
    avatar: string
  }
  
  interface NewMessageModalProps {
    show: boolean
    onHide: () => void
    onSelect: (person: Person) => void
  }
  
  export function NewMessageModal({ show, onHide, onSelect }: NewMessageModalProps) {
    const people: Person[] = [
      {
        id: 1,
        name: "Jacob Jones",
        title: "Sales Manager",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "Charles Clark",
        title: "Marketing Manager",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        name: "Mia Anderson",
        title: "Accountant",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 4,
        name: "Zoe Turner",
        title: "Research Scientist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ]
  
    if (!show) return null
  
    return (
      <>
        <div className="modal fade show" tabIndex={-1} style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title">Select Person</h5>
                <button type="button" className="btn-close" onClick={onHide}></button>
              </div>
              <div className="modal-body">
                <div className="position-relative mb-3">
                  <input type="search" className="form-control" placeholder="New message to:" />
                  <i className="fas fa-search position-absolute top-50 end-3 translate-middle-y text-muted"></i>
                </div>
                <div className="d-flex flex-column gap-2">
                  {people.map((person) => (
                    <button
                      key={person.id}
                      className="btn btn-light text-start d-flex align-items-center gap-3 p-2 rounded-3"
                      onClick={() => onSelect(person)}
                    >
                      <img
                        src={person.avatar || "/placeholder.svg"}
                        alt={person.name}
                        className="rounded-circle"
                        width={48}
                        height={48}
                      />
                      <div>
                        <div className="fw-medium">{person.name}</div>
                        <small className="text-muted">{person.title}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
    )
  }