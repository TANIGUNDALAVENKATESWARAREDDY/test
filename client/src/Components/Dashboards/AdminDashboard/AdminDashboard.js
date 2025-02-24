import React from 'react';
import './AdminDashboard.css';
import Sidenav from '../../Sidenav/Sidenav';
// import { useNavigate } from 'react-router-dom';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Topnav from '../../Topnav/Topnav';
import Boyandgirl from './Images/boyandgirl.png';
import Certificates from './Images/certificates.png';
import Motherandson from './Images/motherandson.png';
import papers from './Images/papers.png';

// inventory images
import Books from './Images/books.png';
import IDcard from './Images/idcard.png';
import Uniform from './Images/uniformin.png';
import whiteboard from './Images/whiteboard.png';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


function AdminDashboard(){
    // const navigate = useNavigate();

    const data = {
        labels: ['Paid', 'Unpaid'],
        datasets: [
          {
            label: 'Total fee',
            data: [62, 38],
            backgroundColor: [
              '#1564bf',
              '#b2d6ff',
            //   'rgba(255, 206, 86, 0.2)',
            //   'rgba(75, 192, 192, 0.2)',
            //   'rgba(153, 102, 255, 0.2)',
            //   'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              '#1564bf',
              '#b2d6ff',
            //   'rgba(255, 206, 86, 1)',
            //   'rgba(75, 192, 192, 1)',
            //   'rgba(153, 102, 255, 1)',
            //   'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    {/* your code strat form here */}

                    <div className='staffdashboard-top-boxes'>
                        <div className='staffdashboard-top-boxes-each'>
                            <div className='staffdashboard-top-boxes-each-p'>
                                <p>240</p>
                                <h2>Total students</h2>
                            </div>
                            <div className='staffdashboard-top-boxes-each-img'>
                                <img src={Boyandgirl} alt='staff1'/>
                            </div>
                        </div>

                        <div className='staffdashboard-top-boxes-each'>
                            <div className='staffdashboard-top-boxes-each-p'>
                                <p>40</p>
                                <h2>Total teachers</h2>
                            </div>
                            <div className='staffdashboard-top-boxes-each-img'>
                                <img src={Motherandson} alt='staff1'/>
                                
                            </div>
                        </div>

                        <div className='staffdashboard-top-boxes-each'>
                            <div className='staffdashboard-top-boxes-each-p'>
                                <p>520</p>
                                <h2>Total applications</h2>
                            </div>
                            <div className='staffdashboard-top-boxes-each-img'>
                                <img src={Certificates} alt='staff1'/>
                            </div>
                        </div>

                        <div className='staffdashboard-top-boxes-each'>
                            <div className='staffdashboard-top-boxes-each-p'>
                                <p>320</p>
                                <h2>Total admissions</h2>
                            </div>
                            <div className='staffdashboard-top-boxes-each-img'>
                                <img src={papers} alt='staff1'/>
                            </div>
                        </div>
                        
                    </div>

                    {/* second section div */}
                    <div className='staffdashboard-second-section'>
                        {/* first div */}
                        <div className='staffdashboard-second-section-first'>

                            <div className='staffdashboard-second-first-feegraph'>
                                <h2 className='staffdashboard-sf-invent-head'>Fee Details</h2>
                                <div className='staffdashboard-sf-feegraph-des' style={{marginTop:10}} >
                                    <div className='staffdashboard-sf-graph-size'>
                                        <Doughnut data={data}
                                        options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false  }}/>
                                    </div>
                                    
                                    <div className='staffdashboard-sf-feegraph-des-all'>
                                        
                                        <div  className='staffdashboard-sf-feegraph-des-each-inner'>
                                            <div>
                                                <div className='staffdashboard-sf-feegraph-small' style={{background:'#1564bf'}}></div>
                                                <p>paid students</p>
                                            </div>
                                            <p>61.8%</p>
                                        </div>

                                        <div  className='staffdashboard-sf-feegraph-des-each-inner'>
                                            <div>
                                                <div className='staffdashboard-sf-feegraph-small' style={{background:'#b2d6ff'}}></div>
                                                <p>unpaid students</p>
                                            </div>
                                            <p>38.2%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='staffdashboard-second-first-inventroy'>
                                <h2 className='staffdashboard-sf-invent-head'>Inventroy Details</h2>

                                <div className='staffboard-sf-invertory-all'>

                                    <div className='staffboard-sf-invertory-each'>
                                        <div className='staffboard-sf-invertory-each-one'>
                                            <div className='staffboard-sf-invertory-img'>
                                                <img src={Books} alt='inventory-one'/>
                                            </div>
                                            <div className='staffboard-sf-invertory-each-des'>
                                                <p>Test Books</p>
                                                <p><span style={{fontSize:'0.8rem',fontWeight:500 , color:'#064a9a'}}>6th - 10th</span></p>
                                            </div>
                                        </div>
                                        <p>Price: ₹30,000</p>

                                        <ChevronRightIcon sx={{fontSize:22}}/>
                                    </div>

                                    <div className='staffboard-sf-invertory-each'>

                                    <div className='staffboard-sf-invertory-each-one'>
                                        <div className='staffboard-sf-invertory-img'>
                                            <img src={Uniform} alt='inventory-two'/>
                                        </div>
                                        <div className='staffboard-sf-invertory-each-des'>
                                            <p>Uniform</p>
                                            <p><span style={{fontSize:'0.8rem',fontWeight:500 , color:'#064a9a'}}>6th - 10th</span></p>
                                        </div>
                                    </div>
                                        <p>Price: ₹30,000</p>

                                        <ChevronRightIcon sx={{fontSize:22}}/>
                                    </div>

                                    <div className='staffboard-sf-invertory-each'>
                                    <div className='staffboard-sf-invertory-each-one'>
                                        <div className='staffboard-sf-invertory-img'>
                                            <img src={whiteboard} alt='inventory-three'/>
                                        </div>
                                        <div className='staffboard-sf-invertory-each-des'>
                                            <p>White board</p>
                                            <p><span style={{fontSize:'0.8rem',fontWeight:500 , color:'#064a9a'}}>6th - 10th</span></p>
                                        </div>
                                    </div>
                                        <p>Price: ₹30,000</p>

                                        <ChevronRightIcon sx={{fontSize:22}}/>
                                    </div>

                                    <div className='staffboard-sf-invertory-each'>
                                        <div className='staffboard-sf-invertory-each-one'>
                                            <div className='staffboard-sf-invertory-img'>
                                                <img src={IDcard} alt='inventory-four'/>
                                            </div>
                                            <div className='staffboard-sf-invertory-each-des'>
                                                <p>ID Cards</p>
                                                <p><span style={{fontSize:'0.8rem',fontWeight:500 , color:'#064a9a'}}>6th - 10th</span></p>
                                            </div>
                                        </div>
                                        <p>Price: ₹30,000</p>

                                        <ChevronRightIcon sx={{fontSize:22}}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* second div */}
                        <div className='staffdashboard-second-section-second'>

                            <div className='staffdash-ss-trans-notifications'>
                                <div className='staffdash-ss-trans'>
                                    <h2 className='staffdashboard-sf-invent-head'>Transport Details</h2>
                                    <div>
                                        <p>Bus Users</p>
                                        <p>120</p>
                                    </div>

                                    <div>
                                        <p>Bus fee paid students</p>
                                        <p>120</p>
                                    </div>
                                </div>

                                

                            </div>

                        </div>
                    </div>

                    {/* your code end's ere */}
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;