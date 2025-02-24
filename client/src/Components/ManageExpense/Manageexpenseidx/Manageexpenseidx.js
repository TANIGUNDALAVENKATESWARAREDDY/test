import React from "react";
import './Manageexpenseidx.css';
import Sidenav from "../../Sidenav/Sidenav";
import Topnav from "../../Topnav/Topnav";
import Exbanner from "../../../Assets/Expense mana.png";
import addexpense from "../../../Assets/addexpense.png";
import expenseReport from "../../../Assets/expense reports.png";
import expenseApproval from "../../../Assets/expense approval.png";
import expenseView from "../../../Assets/view expense.png";

function Manageexpenseidx(){
    return(
        <>
            <div className='staffdashboard-con'>
                <Sidenav/>
                <div className='staffdashboard-inner'>
                    <Topnav/>
                    <div className='main-inner-container'>
                        {/* // write your code here \\ */}
                        <div className="managefee_banner">
                            <img src={Exbanner} alt="banner"></img>
                            {/* <div className="managefee_text-overlay">Expense Management</div> */}
                        </div>
                        <div className="managefee_con">
                            <div className="managefee_feefeature">
                                <div className="managefee_image">
                                    <img src={addexpense} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5> Add Expense</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature">
                                <div className="managefee_image">
                                    <img src={expenseView} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>View Expense</h5>
                                </div>
                            </div>

                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={expenseApproval} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Expense Approvals</h5>
                                </div>
                            </div>
                        
                            <div className="managefee_feefeature" >
                                <div className="managefee_image">
                                    <img src={expenseReport} alt="feeImage"/>
                                </div>
                                <div className="managefee_heading">
                                    <h5>Reports</h5>
                                </div>
                            </div>

                            

                            
                        </div>

                        {/* your code ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Manageexpenseidx;