import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import SignatureCanvas from "react-signature-canvas";
import { saveAs } from 'file-saver'; // Importing file-saver
import './landowner.css'; // Importing the CSS file for styling
import { API_URL } from '../../../utils/constants';
import useUser from '../../../hooks/useUser';
import { FaBell, FaChevronDown, FaChevronRight, FaCloudflare, FaCog, FaEnvelope, FaFile, FaFileArchive, FaFilePdf, FaFileUpload, FaSignature, FaUpload, FaUser} from 'react-icons/fa';
import { FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { MdEditDocument, MdFileUpload } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import pdf1 from '../../../assets/pdf1.png'
import pdf from '../../../assets/pdf.png'

function Dashboard() {
  const loggedUser = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recipient, setRecipient] = useState(''); 
  const [users, setUsers] = useState([]); 
  const [currentStep, setCurrentStep] = useState(1);
  const [transferDetails, setTransferDetails] = useState({
    landId: '',
    presentLandSize: '',
    ownerName: '',
    ownerEmail: '',
    landLocation: '',
    nationalId: '',
    buyerName: '',
    buyerEmail: '',
    buyerAddress: '',
    landSizeToSell: '',
    sellingType: '',
  });
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Adjust as needed
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [activeSection, setActiveSection] = useState('home');
  const [name, setName] = useState(''); // Name for the signature input
  const sigCanvas = useRef({}); // Ref for signature pad
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // State for destinationDashboard
  const [user, setUser] = useState(null); // Selected user

  const [file, setFile] = useState(null); // Selected file

  const [requests, setRequests] = useState([]);
  const [unfold, setUnFold] = useState(false)

  // Handle Search
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = requests.filter((request) =>
      Object.values(request).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, requests]);

  // Handle Sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = React.useMemo(() => {
    if (sortConfig.key) {
      const sorted = [...filteredRequests].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return filteredRequests;
  }, [filteredRequests, sortConfig]);

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedRequests.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedRequests.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //Fetching ownership transfered requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/transfer-ownership`); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();


        // Assuming `data` is an array; otherwise, adjust if the structure is different
        setRequests([...data].filter((item)=> item?.owner_email === loggedUser?.email));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRequests();
  }, []);

  // Fetching list of users from the backend
  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component
    axios.get(`${API_URL}/api/users`)
      .then((response) => {
        if (isMounted) setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error getting users from DB:", error);
        alert("Failed to fetch users. Please try again later.");
      });

    return () => { isMounted = false; };
  }, []);

  // Fetching files when "Files" section is active
  useEffect(() => {
    if (activeSection === 'files') {
      fetchFiles();
    }
  }, [activeSection]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination_dashboard', destinationDashboard);
    formData.append('recipient', user); // Assuming you want to send the user ID
    try {
      const response = await axios.post(`${API_URL}/api/pdfs/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.data){
        toast.success('Message sent successfully !!!')
      }
      // Optionally reset the form
      setFile(null);
      setDestinationDashboard('');
      setUser(null);
    } catch (error) {
      toast.error('There was an error sending the message. Please try again !!!')
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pdfs`);
      setFiles([...response.data].filter((item)=> item?.recipient === loggedUser?.id));
    } catch (error) {
      console.error("Error getting files from DB:", error);
      toast.error('Failed to fetch files. Please try again later.')
    }
  }


  const showContent = (section) => {
    setActiveSection(section);
  };

  const clearSignature = () => sigCanvas.current.clear();

  const saveSignature = () => {
    if (!name.trim()) {
      alert('Please enter your name before saving the signature.');
      return;
    }

    try {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const blob = dataURLToBlob(dataUrl);
      const signatureFileName = `${name.trim()}_signature.png`;

      saveAs(blob, signatureFileName);
      console.log(`Signature saved for ${name}:`, dataUrl);
      alert("Signature saved successfully.");
      // Optionally clear the canvas and name
      clearSignature();
      setName('');
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("There was an error saving your signature. Please try again.");
    }
  };

  const dataURLToBlob = (dataUrl) => {
    try {
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const buffer = new ArrayBuffer(byteString.length);
      const data = new Uint8Array(buffer);

      for (let i = 0; i < byteString.length; i++) {
        data[i] = byteString.charCodeAt(i);
      }

      return new Blob([buffer], { type: mimeString });
    } catch (error) {
      console.error("Error converting data URL to Blob:", error);
      throw error;
    }
  };

  const updateField = (e) => {
    setTransferDetails({
      ...transferDetails,
      [e.target.name]: e.target.value,
    });
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    try {
      const data = {
        land_id: transferDetails.landId,
        present_land_size: transferDetails.presentLandSize,
        owner_name: transferDetails.ownerName,
        owner_email: transferDetails.ownerEmail,
        land_location: transferDetails.landLocation,
        national_id: transferDetails.nationalId,
        buyer_name: transferDetails.buyerName,
        buyer_email: transferDetails.buyerEmail,
        buyer_address: transferDetails.buyerAddress,
        land_size_to_sell: transferDetails.landSizeToSell,
        selling_type: transferDetails.sellingType,
      };
      const response = await axios.post(
        `${API_URL}/api/transfer-ownership`,
        data
      );
      if (response.status === 201) {
        toast.success('Request Taken into consideration. Thank you !!!', {
          onClose: ()=> setCurrentStep(1)
        })
        setTransferDetails({
          landId: '',
          presentLandSize: '',
          ownerName: '',
          ownerEmail: '',
          landLocation: '',
          nationalId: '',
          buyerName: '',
          buyerEmail: '',
          buyerAddress: '',
          landSizeToSell: '',
          sellingType: '',
        });
      } else {
        toast.error(response?.data?.message ?? 'An error occured when creating your request try again !!!')
      }
    } catch (error) {
      toast.error( error.response ? error.response.data : error.message ?? 'There was an error processing your request try again !!!')
    }
  };

  // redirect to home is role doesn't match
  useEffect(()=>{
    let user = sessionStorage.getItem('fragmark_user');
    if(user){
        user = JSON.parse(user);
        if(user?.profile?.role !== 'land_owner'){
          window.location.href = '/'
        }
    }
  },[])

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`owner_sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li onClick={()=> {
            setUnFold((unfold)=> !unfold)
            }} className={unfold ? 'active' : ''}>
            <a href="#!" style={{padding: unfold ? '4%' : '1%'}}>
              <FaUser color='white'/>  
              <span className='text-sm'>Ownership Transfer </span>
              <FaChevronRight />
            </a>
          </li>
          {
              unfold && 
              <ul className='w-1/2 h-auto ml-8'>
              <li>
                <a style={{backgroundColor: 'transparent', textDecoration: 'underline'}} href="#!" onClick={() => {
            
                  showContent('transferofownership')
                  }}>
                  <span>List of transfers</span>
                </a>
              </li>

              <li >
                <a href="#!" style={{backgroundColor: 'transparent', textDecoration: 'underline'}} onClick={() => showContent('request')}>
                  <span>Requests</span>
                </a>
              </li>
            </ul>}
          <li className={activeSection === 'signature' ? 'active' : ''}>
            <a href="#!" onClick={() => {
              setUnFold(false)
              showContent('signature')
              }}>
              <FaSignature /> 
              <span>Sign Here</span>
            </a>
          </li>
          <li className={activeSection === 'messages' ? 'active' : ''}>
            <a href="#!" onClick={() => {
               setUnFold(false)
              showContent('messages')
              }}>
              
              <MdFileUpload color='white'/>
              <span>Send Document</span>
            </a>
          </li>
          <li className={activeSection === 'files' ? 'active' : ''}>
            <a href="#!" onClick={() => {
               setUnFold(false)
              showContent('files')
              }}>
              <FaFilePdf color='white'/>
              <span className='text-sm'> Received Documents</span>
            </a>
          </li>
          <li className={activeSection === 'notifications' ? 'active' : ''}>
            <a href="#!" onClick={() => {
               setUnFold(false)
              showContent('notifications')
              }}>
              <FaBell color='white'/>
              <span>Notifications</span>
            </a>
          </li>

          <li className={activeSection === 'settings' ? 'active' : ''}>
            <a href="#!" onClick={() => {
               setUnFold(false)
              showContent('settings')
              }}>
              <FaCog color='white'/> 
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        {/* Header */}
        <div className={` ${isCollapsed ? 'collapsed' : ''} h-12 w-full bg-green-600 text-lg flex items-center`} id="header">
          <button className={`${isCollapsed ? 'collapsed' : ''} text-white text-xl font-semibold mx-2`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <span className='text-white'>{'Hi, ' + loggedUser?.username ?? 'Land owner'}</span>
        </div>

        {/* Transfer of Ownership Section */}
        {activeSection === 'transferofownership' && (
          <div className="content active" id="transferofownership">
          <h2 className="text-2xl font-bold mb-4">Request for Ownership of Land Transfer</h2>
          
          <form onSubmit={submitTransfer} className="space-y-4">
            {/* Step 1 */}
            <div className={`step ${currentStep === 1 ? "block" : "hidden"}`}>
              <div className='w-full p-2 flex justify-end items-end'>
                <h3 className='text-lg font-bold text-orange-300'>Step {currentStep} / 2 </h3>
              </div>

              <label htmlFor="landId" className="block text-sm font-medium text-gray-700">Land ID:</label>
              <input
                type="text"
                name="landId"
                id="landId"
                value={transferDetails.landId}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="presentLandSize" className="block text-sm font-medium text-gray-700">Present Land Size (sqm):</label>
              <input
                type="number"
                name="presentLandSize"
                id="presentLandSize"
                value={transferDetails.presentLandSize}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
                min="0"
              />
        
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Owner's Name:</label>
              <input
                type="text"
                name="ownerName"
                id="ownerName"
                value={transferDetails.ownerName}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Owner's Email:</label>
              <input
                type="email"
                name="ownerEmail"
                id="ownerEmail"
                value={transferDetails.ownerEmail}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="landLocation" className="block text-sm font-medium text-gray-700">Land Location:</label>
              <input
                type="text"
                name="landLocation"
                id="landLocation"
                value={transferDetails.landLocation}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID:</label>
              <input
                type="text"
                name="nationalId"
                id="nationalId"
                value={transferDetails.nationalId}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Next Step
              </button>
            </div>
        
            {/* Step 2 */}
            <div className={`step ${currentStep === 2 ? "block" : "hidden"}`}>
              <div className='w-full p-2 flex justify-end items-end'>
                <h3 className='text-lg font-bold text-green-500'>Step {currentStep} / 2 </h3>
              </div>
              <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700">Buyer's Name:</label>
              <input
                type="text"
                name="buyerName"
                id="buyerName"
                value={transferDetails.buyerName}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700">Buyer's Email:</label>
              <input
                type="email"
                name="buyerEmail"
                id="buyerEmail"
                value={transferDetails.buyerEmail}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="buyerAddress" className="block text-sm font-medium text-gray-700">Buyer's Address:</label>
              <input
                type="text"
                name="buyerAddress"
                id="buyerAddress"
                value={transferDetails.buyerAddress}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              />
        
              <label htmlFor="landSizeToSell" className="block text-sm font-medium text-gray-700">Land Size to Sell (sqm):</label>
              <input
                type="number"
                name="landSizeToSell"
                id="landSizeToSell"
                value={transferDetails.landSizeToSell}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
                min="0"
              />
        
              <label htmlFor="sellingType" className="block text-sm font-medium text-gray-700">Selling Type:</label>
              <select
                name="sellingType"
                id="sellingType"
                value={transferDetails.sellingType}
                onChange={updateField}
                required
                className="border rounded w-full p-2"
              >
                <option value="">--Select Selling Type--</option>
                <option value="total">Total</option>
                <option value="diminution">Diminution</option>
              </select>
        
              <div className="flex space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Previous Step
                </button>
                
                <button type="submit" className="bg-green-500 text-white w-auto px-4 py-2 rounded">
                  Submit Transfer
                </button>
              </div>
            </div>
          </form>
        </div>
        
        )}

        {/* Signature Section */}
        {activeSection === 'signature' && (
          <div className="content active" id="signature">
            <h2>Signature</h2>
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
            />
            <div className="signature-buttons">
              <button onClick={clearSignature}>Clear</button>
              <button onClick={saveSignature}>Save Signature</button>
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Name for signature"
            />
          </div>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <div className="content active" id="messages">
            <h2>Messages</h2>
            <form className='w-full h-auto' onSubmit={handleUpload}>
            <div className=" flex justify-start items-center my-4 ">
                <span className='text-lg font-semibold mr-4'>Select User 
                <span className="text-red-500">*</span>:</span>
                <select
                  required
                  id="userSelect"
                  value={user || ''}
                  onChange={(e) => setUser(e.target.value)}
                  className='border w-72 h-10 rounded-md '
                >
                  <option value="">---</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="destinationDashboard">Message  <span className="text-red-500">*</span>:</label>
                <textarea
                  type="text"
                  required
                  id="destinationDashboard"
                  placeholder="Enter message ...."
                  value={destinationDashboard}
                  onChange={(e) => setDestinationDashboard(e.target.value)} 
                  className='w-full h-32 border border-gray-200 rounded p-2'
                >

                </textarea>
              </div>

              <div className="w-full h-64 mb-4 border border-dashed flex flex-col justify-center items-center">
                <label htmlFor="fileUpload" className='text-lg font-normal text-gray-800'>Upload File  <span className="text-red-500">*</span></label>
                <input
                  required
                  hidden
                  type="file"
                  id="fileUpload"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <button className='bg-white' type='button' onClick={()=>{
                  document.getElementById('fileUpload').click();
                }}>
                  <FaUpload  size={40} color='gray'/>
                </button>
                <span className='text-green-500 mt-2'>{file?.name}</span>
              </div>

              <button type="submit">
                Upload PDF
              </button>
            </form>
          </div>
        )}

        {/* Files Section */}
        {activeSection === 'files' && (
          <div className="active mt-4 h-full rounded bg-[#eefdf3] shadow " id="files">
            <h2 className='font-semibold p-4'>My Documents</h2>
            {files?.length === 0 ? (
              <p>No files sent yet.</p>
            ) : (
              <ul className='w-full flex justify-around items-center flex-wrap'>
                {files?.map((fileItem) => (
                 <li key={fileItem.id} className='h-24 bg-white my-2 items-center rounded-2xl flex flex-row' style={{width: '24%'}}>
                    <img src={pdf1} className='w-14 h-14'/>
                    <div className='ml-8 w-3/4 h-3/4 flex flex-col'>
                      <a href={`${API_URL}/${fileItem.file}`} target="_blank" rel="noopener noreferrer" className='underline text-green-700 truncate h-full'>
                        {fileItem?.file?.split('pdfs/')[1]}
                      </a>
                      <textarea value={fileItem?.destination_dashboard} className='p-2 text-sm w-full'></textarea>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


        {/* Requests section*/}
        {activeSection === 'request' && (
          <div className="content active mt-4" id="request">
             <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Ownership Transfer Requests</h3>

      {/* Search Input */}
      <div className="mb-4 flex items-center">
        <FiSearch className="mr-2 text-black-100" />
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 border rounded-lg px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-green border border-green-1000 ">
          <thead>
            <tr className="bg-green-1000 text-black">
              {[
                { label: 'Land ID', key: 'land_id' },
                { label: "Owner's Name", key: 'owner_name' },
                { label: "Owner's Email", key: 'owner_email' },
                { label: 'Present Land Size', key: 'present_land_size' },
                { label: 'Location of Land', key: 'location_of_land' },
                { label: 'National ID', key: 'national_id' },
                { label: "Buyer's Name", key: 'buyer_name' },
                { label: "Buyer's Email", key: 'buyer_email' },
                { label: "Buyer's Address", key: 'buyer_address' },
                { label: 'Land Size to Sell', key: 'land_size_to_sell' },
                { label: 'Selling Type', key: 'selling_type' },
                { label: 'Date of Request', key: 'date_of_request' },
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                  onClick={() => handleSort(column.key)}
                >
                  {/* This is where i have designed the length and width of my table*/}
                  <div className="flex items-center h-10 w-40 rounded-lg">
                    {column.label}
                    {sortConfig.key === column.key ? (
                      sortConfig.direction === 'ascending' ? (
                        <FiChevronUp className="ml-1" />
                      ) : (
                        <FiChevronDown className="ml-1" />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((request, index) => (
                <tr key={index} className="border-b hover:bg-green-100">
                  <td className="px-4 py-2">{request.land_id}</td>
                  <td className="px-4 py-2">{request.owner_name}</td>
                  <td className="px-4 py-2">{request.owner_email}</td>
                  <td className="px-4 py-2">{request.present_land_size}</td>
                  <td className="px-4 py-2">{request.location_of_land}</td>
                  <td className="px-4 py-2">{request.national_id}</td>
                  <td className="px-4 py-2">{request.buyer_name}</td>
                  <td className="px-4 py-2">{request.buyer_email}</td>
                  <td className="px-4 py-2">{request.buyer_address}</td>
                  <td className="px-4 py-2">{request.land_size_to_sell}</td>
                  <td className="px-4 py-2 capitalize">{request.selling_type}</td>
                  <td className="px-4 py-2">{new Date(request.transfer_date).toDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 text-center text-Black-500">
                  No requests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => paginate(idx + 1)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === idx + 1
                    ? 'bg-green-700 text-white'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
          </div>
        )}
        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="content active" id="notifications">
            <h2>Notifications</h2>
            {/* Notifications content */}
            <p>You have no new notifications.</p>
          </div>
        )}
        

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="content active" id="settings">
            <h2>Settings</h2>
            {/* Settings content */}
            <p>Settings functionality coming soon.</p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
