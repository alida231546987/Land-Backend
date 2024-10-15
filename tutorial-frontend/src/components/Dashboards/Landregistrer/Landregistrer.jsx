import React, { useState, useEffect, useRef } from 'react';
import './landregistrer.css'; // Import the CSS file for styling
import SignaturePad from 'react-signature-canvas';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificateOfOwnership } from '../../PDFs/Certificate of ownership/Certificate.jsx';
import { AnalyticalSlip } from '../../PDFs/Analyticslip/AnalyticalSlip.jsx';
import { API_URL } from '../../../utils/constants.js';
import axios from 'axios';
import { FaBell, FaChevronDown, FaChevronRight, FaCloudflare, FaCog, FaEnvelope, FaFile, FaFileArchive, FaFilePdf, FaFileUpload, FaSignature, FaUpload, FaUser, FaLandmark} from  'react-icons/fa';
import { FiSearch, FiChevronUp, FiChevronDown, FiMail, FiInbox,FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import { AiFillFilePdf } from 'react-icons/ai';
import { MdEditDocument, MdFileUpload } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import pdf1 from '../../../assets/pdf1.png'
import pdf from '../../../assets/pdf.png'
import debounce from 'lodash.debounce';

// import { notarialdeed } from '../../PDFs/NotarialDeed/notarialdeed';


function Dashboard() {
  // State to manage the sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [files, setFiles] = useState([]); // Files state
  const [destinationDashboard, setDestinationDashboard] = useState(''); // Define state for destinationDashboard
  const [handleUplaod, setHandleUpload] = useState(''); // Define state for destinationDashboard
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [handleSubmit, setHandleSubmit] = useState(null);
  const [handleChange, setHandleChange] = useState(null);
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Adjust as needed
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [name, setName] = useState(''); // Name for the signature input
  const sigCanvas = useRef({}); // Ref for signature pad
  const [unfold, setUnFold] = useState(false)
  const[landtitle,  SetLandTitle] = useState("");

    // Handle Search
    useEffect(() => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = requests.filter((landtitle) =>
        Object.values(landtitle).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredRequests(filtered);
      setCurrentPage(1); // Reset to first page on search
    }, [searchQuery, landtitle]);
  
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
  

  // For Email Messages 
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [filee, setFilee] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmite = async (e) => {
    e.preventDefault();

      // Debugging: Log the current state
    console.log('Recipient:', recipient);
    console.log('Message:', message);
    console.log('File:', filee);

    if (!recipient || !message || !filee) {
      setStatusMsg('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('recipient', recipient);
    formData.append('message', message);
    formData.append('file', filee);

    try {
      const response = await axios.post('http://localhost:8000/api/send-email/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatusMsg(response.data.success);
      setRecipient('');
      setMessage('');
      setFile(null);
      // Reset the file input
      document.getElementById('fileInput').value = '';
    } catch (error) {
      if (error.response && error.response.data) {
        setStatusMsg(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        setStatusMsg('An error occurred while sending the email.');
      }
    };
  };

  //Getting list of users form the backend
  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
    .then((response) => setUsers(response.data))
    .catch((error) => {
      console.log("Error getting users from DB");
    })
  }, []);

    //Send files to another user 
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
  
    const showConten = (section) => {
      setActiveSection(section);
      if (section === 'files') {
        fetchFiles(); // Fetch files when "Files" section is active
      }
    };

    

  const [searchTerm , setSearchTerm] = useState("");
  const handleSearch = debounce((event) => {
      setSearchTerm(event.target.value);
  }, 300);

      const debouncedSearch = debounce((term) => {
        // Your search logic here
        console.log(`Searching for: ${term}`);
    }, 300); // 300 milliseconds delay

    // Effect to handle changes to the searchTerm
    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        }

        // Cleanup function to cancel the debounce on unmount or when searchTerm changes
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm]); // Dependency array to re-run the effect on searchTerm change
  
  

  const [pdfFiles, setPdfFiles] = useState([]); // Define pdfFiles state

  //Generate pdf for land title
  const [landId, setLandId] = useState('');
  const [slip, setSlip] = useState({});
  const [propertyDetails, setPropertyDetails] = useState({
    nature: "",
    land_size: 0,
    land_location: "",
    coordinates: {}
  });
  const [ownerDetails, setOwnerDetails] = useState({
    owner_name: "",
    profession: "",
    address: "",
    dob: "",
    pob: "",
    father_name: "",
    mother_name: "",
    delivery_date: ""
  });
  const [error, setError] = useState('');

  const handleFetchDetails = async () => {
    try {
      setError('');
      const response = await axios.get(`http://localhost:8000/api/landtitles`);
      const data = response.data;

      setSlip({ land_id: data.land_id });
      setPropertyDetails({
        nature: data.nature,
        land_size: data.land_size,
        land_location: data.land_location,
        coordinates: data.coordinates
      });
      setOwnerDetails({
        owner_name: data.owner_name,
        profession: data.profession,
        address: data.address,
        dob: data.dob,
        pob: data.pob,
        father_name: data.father_name,
        mother_name: data.mother_name,
        delivery_date: data.delivery_date
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch land details. Please check the Land ID.');
    }
  };

  //Form to establish new land title
  const [formData, setFormData] = useState({
    landId: '',
    nature: '',
    size: '',
    location: '',
    area: '', // Added
    coordinates: { latitude: '', longitude: '' },
    fullName: '',
    email: '', // Added
    cniid: '', // Added
    profession: '',
    address: '',
    dob: '',
    pob: '',
    fatherName: '',
    motherName: '',
    deliveryDate: ''
  });

  const updateField = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    try{
      const data = {
        land_id : formData.landId,
        owner_name : formData.fullName,
        owner_email : formData.email,
        land_location : formData.location,
        national_id : formData.cniid,
        land_size : formData.size,
        surface_area : formData.area,
        coordinates : formData.coordinates,
        nature : formData.nature,
        profession : formData.profession,
        address : formData.address,
        dob : formData.dob,
        pob : formData.pob,
        father_name : formData.fatherName,
        mother_name : formData.motherName,
        delivery_date : formData.deliveryDate,
      };
      const response = await axios.post(
        'http://localhost:8000/api/landtitles',
        data
      );
      if (response.status === 201){
        alert('New land title information recorded');
        setFormData({
          landId: '',
          nature: '',
          size: '',
          location: '',
          area: '', // Reset added field
          coordinates: { latitude: '', longitude: '' },
          fullName: '',
          email: '', // Reset added field
          cniid: '', // Reset added field
          profession: '',
          address: '',
          dob: '',
          pob: '',
          fatherName: '',
          motherName: '',
          deliveryDate: '',
        });
      } else{
        // Use optional chaining and fallback
        alert('Error: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      // Use optional chaining to prevent TypeError
      console.log(error.response?.data || error);
      alert('There was an error processing your request');
    }
  };

  //Fetch files sent form the db
  useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pdfs/'); // Adjust your API endpoint as necessary
        setPdfFiles(response.data);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPdfFiles();
  }, []);

  // State to manage which content section is active
  const [activeSection, setActiveSection] = useState('home');

  const [signature, setSignature] = useState('');
  const signatureRef = useRef(null);

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL(); // Save as image data
      // console.log('Signature saved:', signatureData);
      setSignature(signatureData); // Update the signature state
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear(); // Clear the canvas
      setSignature(''); // Reset the signature state
    }
  };
  

  const [landData, setLandData] = useState({
    owner_name: "",
    land_location: "",
    land_size: "",
    nature:"",
    coordinates: "",
    profession: "",
    address: "",
    dob: "",
    father_name: "",
    pob: "",
    mother_name:"",
    delivery_date: ""
  });
  // State to manage transfer requests
  const [requests, setRequests] = useState([]);

  // State to manage selected document for PDF generation
  const [selectedDocument, setSelectedDocument] = useState(<CertificateOfOwnership data={[{
    Owner_name: "",
    Location: "",
    Size: ""
  }]} />
);
  
  const [selectedDocument1, setSelectedDocument1] = useState(<AnalyticalSlip data={[{
   ...landData
  }]}  />)
  const [fileName, setFileName] = useState("");

  const formatCoordinates=(data)=>{
    let str = ``
    if(!data) return str;
    data?.forEach((item)=>{
      str+=`Latitude: ${item?.latitude} - Longitude: ${item?.longitude}\n`
    })

    return str;
  }


  useEffect(() => {
    console.log('changed ....: ', landData)
    setSelectedDocument(
      <CertificateOfOwnership data={[{
        Owner_name: landData.owner_name,  // Use 'data' here instead of 'request'
        Location: landData.land_location,
        Size: landData.land_size,
      }]} signature={signature} />
    )
    setSelectedDocument1(
      <AnalyticalSlip data={[{
        ...landData,
        coordinates: formatCoordinates(landData?.coordinates ?? [])
      }]} signature={signature} />
    )
  }, [signature]);

  // fetch land data
  const fetchLandData =async()=>{
    axios.get(`${API_URL}/api/landtitles/${landId}`)
    .then((response) => {
      console.log('data: ',response.data);
      setLandData({...response.data})
    })
    .catch((error) => {
      console.log(`Error getting land title`);
      console.log(error);
    })
  }

  // Fetch transfer ownership requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/transfer-ownership'); // Ensure the correct endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Assuming `data` is an array; otherwise, adjust if the structure is different
        setRequests(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRequests();
  }, []); 

  useEffect(()=>{
    fetchLandData();
  },[landId])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to show content based on sidebar selection
  const showContent = (section) => {
    setActiveSection(section);
  };


  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className={activeSection === 'home' ? 'active' : ''}>
            <a href="#" onClick={() =>{ 
              setUnFold(false) 
              showContent('home')
            }}>
              <FiMail />
              <span>Send Email</span>
            </a>
          </li>
          <li className={activeSection === 'transferofownershiprequest' ? 'active' : ''}>
            <a href="#" onClick={() =>{
                setUnFold(false)
               showContent('transferofownershiprequest')
               }}>
              <FiInbox color ='white'/>
              <span>Transfer request</span>
            </a>
          </li>
          <li className={activeSection === 'messages' ? 'active' : ''}>
            <a href="#" onClick={() =>{ 
              setUnFold(false)
              showContent('messages')}}>
              <FiMessageSquare />
              <span>Messages</span>
            </a>
          </li>
          <li className={activeSection === 'Send-a-file' ? 'active' : ''}>
            <a href="#" onClick={() =>{ 
              setUnFold(false)
              showContent('Send-a-file')}}>
                <FiSend />
              <span>Send a file</span>
            </a>
          </li>
          <li className={activeSection === 'profile' ? 'active' : ''}>
            <a href="#" onClick={() => {
              setUnFold(false)
              showContent('profile')}}>
              <FiUser />
              <span>Profile</span>
            </a>
          </li>
          <li onClick={()=> {
            setUnFold((unfold)=> !unfold)
            }} className={unfold ? 'active' : ''}>
            <a href="#!" style={{padding: unfold ? '4%' : '1%'}}>
              <FaLandmark />  
              <span className='text-sm'>Land Title </span>
              <FaChevronRight />
            </a>
          </li>
          {
              unfold && 
              <ul className='w-1/2 h-auto ml-8'>
              <li>
                <a style={{backgroundColor: 'transparent', textDecoration: 'underline'}} href="#!" onClick={() => {
            
                  showContent('land-title')
                  }}>
                  <span>Create new land title</span>
                </a>
              </li>

              <li >
                <a href="#!" style={{backgroundColor: 'transparent', textDecoration: 'underline'}} onClick={() => showContent('list-of-landtitle')}>
                  <span>Lists of Landtitles</span>
                </a>
              </li>
            </ul>}
          {/* <li className={activeSection === 'land-title' ? 'active' : ''}>
            <a href="#" onClick={() => showContent('land-title')}>
              <i className="fa fa-cog"></i> Establish Land Title
            </a>
          </li> */}
          <li className={activeSection === 'generate-pdfs' ? 'active' : ''}>
            <a href="#" onClick={() => {
              setUnFold(false)
              showContent('generate-pdfs')}}>
              <i className="fa fa-file-pdf"></i> Generate PDFs
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`} id="main-content">
        {/* Header Section */}
        <div className={`header ${isCollapsed ? 'collapsed' : ''}flex items-center space-x-2`} id="header">
          <button className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}text-white text-xl font-semibold mx-2 flex items-center space-x-2`} onClick={toggleSidebar}>
            &#9776;
          </button>
          <b>Land register</b>
        </div>

        {/* Content Sections */}
        <div className={`content ${activeSection === 'home' ? 'active' : ''}`} id="home">
        <h2>Send an Email</h2>
            <form onSubmit={handleSubmite}>
            <div>
              <label>Recipient Email:</label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
            <div className="w-200">
              <label>Message:</label>
              <input
              className="w-200"
              type="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                />
            </div>
            <div>
              <label>Attach File:</label>
              <input
                type="file"
                id="fileInput"
                onChange={(e) => setFilee(e.target.files[0])}
                required
              />
            </div>
            <button type="submit">Send Email</button>
          </form>
          {statusMsg && <p>{statusMsg}</p>}
        </div>

        <div className={`content ${activeSection === 'transferofownershiprequest' ? 'active' : ''}`} id="transferofownershiprequest">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-black-700 mb-4">Transfer Requests</h2>

            {/* Search bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by Land ID, Owner or Buyer..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearch} // Define the handleSearch function to filter data
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="py-3 px-4 text-left">Land ID</th>
                    <th className="py-3 px-4 text-left">Owner's Name</th>
                    <th className="py-3 px-4 text-left">Owner's Email</th>
                    <th className="py-3 px-4 text-left">Present Land Size</th>
                    <th className="py-3 px-4 text-left">Location of Land</th>
                    <th className="py-3 px-4 text-left">National ID</th>
                    <th className="py-3 px-4 text-left">Buyer's Name</th>
                    <th className="py-3 px-4 text-left">Buyer's Email</th>
                    <th className="py-3 px-4 text-left">Buyer's Address</th>
                    <th className="py-3 px-4 text-left">Land Size to Sell</th>
                    <th className="py-3 px-4 text-left">Selling Type</th>
                    <th className="py-3 px-4 text-left">Date of Request</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((request, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-4">{request.land_id}</td>
                        <td className="py-2 px-4">{request.owner_name}</td>
                        <td className="py-2 px-4">{request.owner_email}</td>
                        <td className="py-2 px-4">{request.present_land_size}</td>
                        <td className="py-2 px-4">{request.location_of_land}</td>
                        <td className="py-2 px-4">{request.national_id}</td>
                        <td className="py-2 px-4">{request.buyer_name}</td>
                        <td className="py-2 px-4">{request.buyer_email}</td>
                        <td className="py-2 px-4">{request.buyer_address}</td>
                        <td className="py-2 px-4">{request.land_size_to_sell}</td>
                        <td className="py-2 px-4">{request.selling_type}</td>
                        <td className="py-2 px-4">{request.date_of_request}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="py-4 text-center text-gray-500">No requests available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className={`content ${activeSection === 'messages' ? 'active' : ''}`} id="messages">
        <h2>Messages</h2>
        <ul>
            {pdfFiles.length > 0 ? (
                pdfFiles.map((pdf) => (
                    <li key={pdf.id}>
                        <a 
                            href={`http://localhost:8000${pdf.file}/`} // Adjusted to the correct URL for the PDF
                            target="_blank" 
                            rel="noopener noreferrer" 
                            download // This attribute enables downloading
                        >
                            {pdf.file.split('/').pop()}  {/* Displaying the file name */}
                        </a>
                        <p>Uploaded At: {new Date(pdf.uploaded_at).toLocaleString()}</p>
                        <p>Destination Dashboard: {pdf.destination_dashboard}</p>
                    </li>
                ))
            ) : (
                <li>No PDF files found.</li>
            )}
        </ul>

        </div>

        {/* Messages Section */}
        {activeSection === 'Send-a-file' && (
          <div className="content active" id="Send-a-file">
            <input type="file" onChange={handleFileChange} />
            <input
              type="text"
              placeholder="Destination Dashboard"
              value={destinationDashboard}
              onChange={(e) => setDestinationDashboard(e.target.value)}
            />

            <div>
              <label htmlFor="">User</label>
              <select value={users} onChange={(e) => setUsers(e.target.value)}>
                <option value={null}>---</option>
                {
                  users && Array.isArray(users) && users.map((u, index) => (
                    <option value={u.id} key={index}>{u.username}</option>
                  ))
                }
              </select>
            </div>
            <button onClick={handleUpload}>Upload PDF</button>
          </div>
        )};

        <div className={`content ${activeSection === 'profile' ? 'active' : ''}`} id="profile">
          <h2>Profile</h2>
        </div>

        <div className={`content ${activeSection === 'land-title' ? 'active' : ''}`} id="land-title">
          <h2>Establish new Land title</h2>
          <form onSubmit={submitTransfer}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <label htmlFor="landId">Land Id:</label>
                  <input type="text" name="landId" id="landId" value={formData.landId} onChange={updateField} required /><br />

                  <label htmlFor="nature">Nature of the Property:</label>
                  <input type="text" name="nature" id="nature" value={formData.nature} onChange={updateField} required /><br />

                  <label htmlFor="size">Land Size:</label>
                  <input type="text" name="size" id="size" value={formData.size} onChange={updateField} required /><br />

                  <label htmlFor="location">Land Location:</label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={updateField} required /><br />

                  <label htmlFor="area">Surface Area:</label>
                  <input type="text" name="area" id="area" value={formData.area} onChange={updateField} required /><br />

                  <label htmlFor="coordinates">Coordinates:</label>
                  <input type="text" name="coordinates" id="coordinates" value={formData.coordinates} onChange={updateField} /><br />

                  <label htmlFor="fullName">New Owner's Full Name:</label>
                  <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={updateField} required/><br />

                  <label htmlFor="email">New Owner's Email:</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={updateField} required /><br />

                  <label htmlFor="cniid">National Id Number:</label>
                  <input type="text" name="cniid" id="cniid" value={formData.cniid} onChange={updateField} required/><br />

                  <label htmlFor="profession">Profession:</label>
                  <input type="text" name="profession" id="profession" value={formData.profession} onChange={updateField} required/><br />

                  <label htmlFor="address">Address:</label>
                  <input type="text" name="address" id="address" value={formData.address} onChange={updateField} required /><br />

                  <label htmlFor="dob">Date Of Birth:</label>
                  <input type="date" name="dob" id="dob" value={formData.dob} onChange={updateField} required /><br />

                  <label htmlFor="pob">Place Of Birth:</label>
                  <input type="text" name="pob" id="pob" value={formData.pob} onChange={updateField} required /><br />

                  <label htmlFor="fatherName">Father's Name:</label>
                  <input type="text" name="fatherName" id="fatherName" value={formData.fatherName} onChange={updateField} required/><br />

                  <label htmlFor="motherName">Mother's Name:</label>
                  <input type="text" name="motherName" id="motherName" value={formData.motherName} onChange={updateField} required /><br />

                  <label htmlFor="deliveryDate">Delivery Date:</label>
                  <input type="date" name="deliveryDate" id="deliveryDate" value={formData.deliveryDate} onChange={updateField} required /><br />
                  <button type="submit">Create new land title</button>
                </div>
              </form>
          </div>
        {/* View list of land title*/}
        <div className = {`content ${activeSection === 'list-of-landtitle' ? 'active' : ''}`} id = "list-of-landtitle">
          <h2>List of existing land titles</h2>
        </div>

        <div className={`content ${activeSection === 'generate-pdfs' ? 'active' : ''}`} id="generate-pdfs">
          <h2>Generate PDFs</h2>
          <div className="pdf-form">
          <label htmlFor="land-id">Land ID:</label>
          <input type="text" id="land-id" placeholder="Enter Land ID" value={landId} onChange={(e) => setLandId(e.target.value)} />

            <label htmlFor="pdf-type">Select PDF Type:</label>
            <select id="pdf-type" onChange={(e) => {
              let value = e.target.value;
              switch (value) {
                case "certificate":
                  setFileName("certificate-of-ownership.pdf");
                  break;
                case "analytical-slip":
                setFileName("analytical-slip.pdf");
                  break;
                default:
                  break;
              }
            }} >
              <option value="certificate">Certificate of Ownership</option>
              <option value="analytical-slip">Analytical Slip</option>
              <option value="notarial-deed">Notarial Deed</option>
              <option value="financial-report">Financial Report</option>
              <option value="inventory-list">Inventory List</option>
            </select>

            <label htmlFor="owner-name">Owner's Name:</label>
            <input type="text" id="owner-name" placeholder="Enter Owner's Name" />

            <label htmlFor="pdf-details">Additional Details:</label>
            <input type="text" id="pdf-details" placeholder="Enter Details" />

            <label htmlFor="signature">Signature:</label>
            <SignatureCanvas ref={signatureRef} penColor="black" canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }} />
            <button type="button" onClick={()=> saveSignature()}>Save Signature</button>
            <button type="button" onClick={()=> clearSignature()}>Clear Signature</button>

            <button className="btn btn-add">
              <PDFDownloadLink
                document={fileName === 'analytical-slip.pdf' ? selectedDocument1 : selectedDocument}
                fileName={fileName}
              >
                {({ loading }) =>
                  loading ? 'Preparing document...' : fileName
                }
              </PDFDownloadLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};  



export default Dashboard;
