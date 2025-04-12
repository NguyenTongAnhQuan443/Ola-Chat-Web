export default function GeneralSetting() {
    return (
      <div>
        
        <div className='mb-3'>
          <label className='form-label'>Avatar</label>
          <input type='file' className='form-control' />
        </div>
        <div className='mb-3'>
          <input type='text' className='form-control' placeholder='Full name' />
        </div>
        <div className='mb-3'>
          <input type='text' className='form-control' placeholder='Username' />
        </div>
        <div className='mb-3'>
          <textarea className='form-control' placeholder='Bio'></textarea>
        </div>
        <button className='btn btn-dark'>Save Changes</button>
      </div>
    )
  }
  