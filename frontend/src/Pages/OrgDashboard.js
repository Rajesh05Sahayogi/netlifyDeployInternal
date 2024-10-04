// pages/OrgDashboard.js
import React from "react";
import OrgForm from "./OrgForm";
import OrgTable from "./OrgTable";
import { Link } from "react-router-dom";
import SearchByPan from "./SearchByPan";

const OrgDashboard = () => {
    return (
        <div className="mt-20  w-full">

            <div className="flex items-center justify-between px-10">
                <div className="text-xl font-bold text-center my-6">Organization Dashboard</div>
                <div className="flex gap-2">
                    <div className="text-sm bg-green-600 text-white rounded p-2 cursor-pointer">
                        <Link to="/OnboardingTeam">Create Org+</Link>
                    </div>
                    <div className="text-sm bg-green-600 text-white rounded p-2 cursor-pointer">
                        <Link to="/OrgDashboard/superAdmin/search-by-pan">Sarch-by-pan</Link>
                    </div>
                    <div className="text-sm bg-green-600 text-white rounded p-2 cursor-pointer">
                        <Link to="/OrgDashboard/superAdmin/Create_User">Create User</Link>
                    </div>
                    <div className="text-sm bg-green-600 text-white rounded p-2 cursor-pointer">
                        <Link to="/OrgDashboard/superAdmin/OrgApprovalPage">OrgApprovalPage</Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div>
                    <OrgTable />
                </div>

            </div>
        </div>
    );
};

export default OrgDashboard;
