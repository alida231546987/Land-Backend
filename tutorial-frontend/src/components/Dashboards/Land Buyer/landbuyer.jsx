import SignatureCanvas from 'react-signature-canvas';
import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver'; // Import file-saver for saving files locally
import './landbuyer.css'; // Import the CSS file for styling
import axios from 'axios';
import { API_URL } from '../../../utils/constants';
import axiosInstance from '../../../config/axios';
import LoadingIndicator from 'react-loading-indicator';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { CONFIG } from '../../../config';
import OM from '../../../assets/OM.jpeg'
import MOMO from '../../../assets/momo.png'
import PaymentsTable from './components/PaymentsTable';
import useUser from '../../../hooks/useUser';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [dashboard, setDashboard] = useState("");
  const loggedUser = useUser();
  const [payment, setPayment] = useState({
    amount: '',
    description: '',
    tel: '',
  })

  const [user, setUser] = useState([]); // Users state
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // Define state for destinationDashboard
  const [handleUplaod, setHandleUpload] = useState(''); // Define state for destinationDashboard
  const [file, setFile] = useState(null);
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isMtn, setIsMtn] = useState(true)
  const [ussd_code,setUssd_code] = useState('*126#')
  const [paymentReference, setPaymentReference] = useState('')
  const [paymentList, setPaymentList] = useState([])
  const [isTableShown, setIsTableShown] = useState([]);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

   // getting list of users from the backend
   useEffect(() => {
    axiosInstance.get(`/api/users`)
    .then((response) => setUser(response.data))
    .catch((error) => {
      console.log("Error getting users from DB");
    })
  }, []);

  function FileUpload() {
    const [destinationDashboard, setDestinationDashboard] = useState('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination_dashboard', destinationDashboard);

    const response = await fetch('http://localhost:8000/api/pdfs/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    console.log("Request completed")
    console.log(data)
    alert("File sent successfully");
  };

  const fetchFiles = async () => {
    axios.get(`${API_URL}/api/pdfs`)
    .then((response) => setFiles(response.data))
    .catch((error) => {
      console.log("Error getting files from DB");
    })
  }

  // function to get all payments
  const fetchPayments= async ()=>{
    try{
      const response = await axiosInstance.get(`/api/payments`)
      if(response.data){
        setPaymentList([...response.data])
      }
    }catch(err){
      toast.error('Error when fetch payments')
    }
  }
  const handlePaymentFormChange=(e)=>{
    const {name, value} = e.target;
    setPayment((payment)=> {
      return {...payment, [name]: value}
    })
  }

  const showContent = (section) => {
    setActiveSection(section);
    if (section === 'files') {
      fetchFiles(); // Fetch files when "Files" section is active
    }
  };

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

  // State to manage signature pad
  const sigCanvas = useRef({});

  // State to manage the name entered by the user
  const [name, setName] = useState('');

  // Function to toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to show content based on sidebar selection
  const showContents = (section) => {
    setActiveSection(section);
  };

  // Function to clear the signature pad
  const clearSignature = () => sigCanvas.current.clear();

  // Function to save the signature
  const saveSignature = () => {
    if (!name) {
      alert('Please enter your name before saving the signature.');
      return;
    }

    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const blob = dataURLToBlob(dataUrl);

    // Combine name and signature for file name
    const signatureFileName = `${name}_signature.png`;

    // Save the signature image with the person's name
    saveAs(blob, signatureFileName);
    console.log(`Signature saved for ${name}:`, dataUrl);
  };

  // Helper function to convert Data URL to Blob
  const dataURLToBlob = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);

    for (let i = 0; i < byteString.length; i++) {
      data[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeString });
  };

  const generateToken= async ()=>{
    try{
    const response = await axios.post('https://demo.campay.net/api/token/',{
      username: 'LWHm0LdslUfK62bZRRGjOV03u9fXpFXcBnhzDNBWGNmUf0OMRhvUVH7vzFZWL3uQBerG2w7qJX__1reqgWFVmQ',
      password: 'x_Udfgxm_potmkY1bWLERV9ZjWBvtmdJ8CsWnqZsqQPKsnZyzWFXRyFNI1-6o8HG-_dwRPrH1Ppi59rHsvLibg'
    })
    return response?.data?.token ?? ''
    }catch(err){
      throw Error(err)
    }finally{
      setIsLoading(false)
    }
  }

  // function to trigger payment
  const makePayment= async (e)=>{
    e.preventDefault();
    setIsLoading(true)
    
    const token = await generateToken();
    
    try{
      const apiPayment = await axios.post(CONFIG.CAMPAY_API_LINK, {
        amount: payment.amount,
        currency: "XAF",
        from: '237'+payment.tel,
        description: payment.description,
        external_reference: '',
        external_user: ''
      }, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if(apiPayment?.data){
        const data = apiPayment?.data;
        console.log('data: ', data)
        setIsMtn(data?.operator?.toLowerCase() === 'mtn')
        setUssd_code(data?.ussd_code)
        setPaymentReference(data?.reference);

        toast('Payment initiaied successfully !!!', {
          type:'success',
          onClose: () => openModal(),
        })
      }
    }catch(err){
        toast.error(err?.message ?? 'Payment failed !!!')
    }finally{
      setIsLoading(false)
    }
  }

  const registerPayment=async ()=>{
    setIsCompleting(true)
    try{
      const response = await axiosInstance.post('/api/payments', {
        ...payment,
        paymentReference,
        operator: isMtn ? 'MTN' : 'Orange'
      })

      if(response.data){
        toast('Payment completed and registered successfully !!!', {
          type: 'success'
        })
      }
    }catch(err){
      console.log(err)
      toast(err?.message ?? 'Payment failed please check your account balance !!!', {
        type: 'error'
      })
    }finally{
      setIsCompleting(false);
      closeModal();
    }
  }

  // redirect to home is role doesn't match
  useEffect(()=>{
    let user = sessionStorage.getItem('fragmark_user');
    if(user){
        user = JSON.parse(user);
        if(user?.profile?.role !== 'land_buyer'){
          window.location.href = '/'
        }
    } 
  },[])

  useEffect(()=>{
    fetchPayments();
  },[])

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'signature' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('signature')}>
              <i className="fa fa-home"></i> Sign here
            </a>
          </li>
          <li className={activeSection === 'messages' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('messages')}>
              <i className="fa fa-envelope"></i> Messages
            </a>
          </li>
          <li className={activeSection === 'notifications' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('notifications')}>
              <i className="fa fa-bell"></i> Notifications
            </a>
          </li>
          <li className={activeSection === 'complaint' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('complaint')}>
              <i className="fa fa-user-circle"></i> Complaint
            </a>
          </li>
          <li className={activeSection === 'payment' ? 'active' : ''}>
            <a href="#" onClick={() => showContents('payment')}>
              <i className="fa fa-cog"></i> Make payement
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        {/* Header Section */}
        <div className={`header ${isCollapsed ? 'collapsed' : ''}`} id="header">
          <button className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <span className='text-white'>{'Hi, ' + loggedUser?.username ?? 'Land owner'}</span>
        </div>

        {/* Signature Section */}
        <div className={`content ${activeSection === 'signature' ? 'active' : ''}`} id="signature">
          <h2>Sign here</h2>
          <div className="signature-pad">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
            />
            <button className="btn btn-clear" onClick={clearSignature}>Clear</button>
            <button className="btn btn-save" onClick={saveSignature}>Save</button>
          </div>

          {/* Input field for the name */}
          <div className="name-input">
            <label htmlFor="name">Enter your name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="content active" id="messages">
            <input type="file" onChange={handleFileChange} />
            <input
              type="text"
              placeholder="Destination Dashboard"
              value={destinationDashboard}
              onChange={(e) => setDestinationDashboard(e.target.value)}
            />

            <div>
              <label htmlFor="">User</label>
              <select value={user} onChange={(e) => setUser(e.target.value)}>
                <option value={null}>---</option>
                {
                  user && Array.isArray(user) && user.map((u, index) => (
                    <option value={u.id} key={index}>{u.username}</option>
                  ))
                }
              </select>
            </div>
            <button onClick={handleUpload}>Upload PDF</button>
          </div>
        )};

        <div className={`content ${activeSection === 'notifications' ? 'active' : ''}`} id="notifications">
          <h2>Notifications</h2>
          <div className="notification-item">New message received.</div>
          <div className="notification-item">User registered successfully.</div>
        </div>

        <div className={`content ${activeSection === 'complaint' ? 'active' : ''}`} id="complaint">
          <h2>Send a complaint</h2>
          <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" placeholder="" /><br /><br />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your email" /><br /><br />

            <button className="button">
              <a href="mailto:nkwetchoulamagorachellealida@gmail.com">Send Email</a>
            </button>
          </form>
        </div>

        <div className={`content ${activeSection === 'payment' ? 'active' : ''}`} id="payment">
          <PaymentsTable data={paymentList} isTableShown={isTableShown} setIsTableShown/>
          <div className={`w-full absolute z-10 h-full`}>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
           <div className='w-[450px] h-[200px]'>
              <div className='w-full flex justify-between items-center mb-2'>
                <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='font-bold' style={{color: 'rgb(47 62 78 / 98%) !important'}}>FragMark Payment</h2>
              </div>

              <div className='mt-2'>
                {
                  isMtn ?
                  <div className='w-full flex flex justify-between items-center'>
                    <img src={MOMO}  className='w-40 h-40'/>
                    <div className='w-1/2 flex justify-center items-center flex-col'>
                      <span className='text-center my-2'>Dial this code to confirm payment</span>
                      <button className='w-32 h-12 bg-yellow-400 rounded shadow-md text-white'>{ussd_code}</button>
                    </div>
                  </div> 
                  :
                  <div className='w-full flex flex justify-between items-center'>
                    <img src={OM}  className='w-40 h-40'/>
                    <div className='w-1/2 flex justify-center items-center flex-col'>
                      <span className='text-center my-2'>Dial this code to confirm payment</span>
                      <div classname="flex w-full flex-col justify-around items-center">
                        <button className='w-20 mr-2 h-12 bg-orange-500 text-sm rounded shadow-md text-white'>{ussd_code}</button>
                        <button type="button" onClick={()=> registerPayment()} disabled={isCompleting} className='w-32 h-12 bg-green-500 rounded text-[12px] shadow-md text-white'>
                          <span>{!isCompleting ? 'Complete Payment' : 'Saving Payment'}</span>
                          {isCompleting && <LoadingIndicator />}
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
           </div>

          </Modal>
          <h2>Make Payment</h2>
          <form onSubmit={makePayment}>
            <label htmlFor="amount">Amount:</label>
            <input type="text" name='amount' value={payment?.amount} onChange={handlePaymentFormChange} id="amount" placeholder="The amount is 100frs" /><br /><br />

            <label htmlFor="number">Phone Number:</label>
            <input type="text" name='tel' value={payment?.tel} onChange={handlePaymentFormChange} id="number" placeholder="Enter your Phone number" /><br /><br />

            <label htmlFor="description"> Description: </label>
            <input type="text" name='description' value={payment?.description} onChange={handlePaymentFormChange} id="description" placeholder="e.g THis payement is for my land title" /><br /><br />

            <button disabled={isLoading} className={!isLoading ? "pbutton" : 'disabledbutton'} type='submit'>
              <span>{isLoading ? 'Initiating payment' : 'Make Payment'}</span>
             {isLoading && <LoadingIndicator />}
            </button>
          </form>
          </div>
        </div>

        
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
