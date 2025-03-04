import React from 'react'
import SideBar from '../layouts/SideBar'
import {Outlet} from "react-router-dom"

function Dashboard() {
  return (
    <div>
      <SideBar />
      <div class="p-4 sm:ml-64">
      <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
