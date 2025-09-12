import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";


export default function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const nav = useNavigate();
  const gridRef = useRef();
  async function fetchData(p = page) {
    const res = await API.get(`/leads?page=${p}&limit=20`);
    setLeads(res.data.data);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  }
  useEffect(() => {
    fetchData(1);
  }, []);

  const columns = [
    {
      headerName: "Name",
      valueGetter: (p) => `${p.data.first_name} ${p.data.last_name}`,
      field: "name",
      sortable: true,
    },
    { headerName: "Email", field: "email", sortable: true },
    { headerName: "Company", field: "company" },
    { headerName: "City", field: "city" },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (p) => {
        const colorMap = {
          new: "bg-blue-100 text-blue-700",
          contacted: "bg-yellow-100 text-yellow-700",
          qualified: "bg-green-100 text-green-700",
          lost: "bg-red-100 text-red-700",
          won: "bg-emerald-100 text-emerald-700",
        };
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold ${
          colorMap[p.value] || "bg-gray-100 text-gray-700"
        }">${p.value}</span>`;
      },
    },
    { headerName: "Score", field: "score" },
    { headerName: "Lead Value", field: "lead_value" },
    {
      headerName: "Actions",
      cellRenderer: (p) => {
        return `
          <div class="flex gap-2 justify-end">
            <button data-id="${p.data._id}" class="edit-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
            <button data-id="${p.data._id}" class="del-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
          </div>`;
      },
    },
  ];

  useEffect(() => {
    const el = document.querySelector(".ag-root");
    function handler(e) {
      if (e.target.matches(".edit-btn")) {
        nav(`/leads/${e.target.dataset.id}`);
      } else if (e.target.matches(".del-btn")) {
        if (!confirm("Delete lead?")) return;
        API.delete(`/leads/${e.target.dataset.id}`).then(fetchData);
      }
    }
    el?.addEventListener("click", handler);
    return () => el?.removeEventListener("click", handler);
  }, [leads]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Leads</h1>
        <button
          onClick={() => nav("/leads/new")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow">
          + New Lead
        </button>
      </div>
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow">
        <span className="text-gray-700">
          Page <strong>{page}</strong> / {totalPages}
        </span>
        <div className="space-x-3">
          <button
            disabled={page <= 1}
            onClick={() => fetchData(page - 1)}
            className={`px-4 py-2 rounded ${
              page <= 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}>
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchData(page + 1)}
            className={`px-4 py-2 rounded ${
              page >= totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}>
            Next
          </button>
        </div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={leads}
          columnDefs={columns}
          defaultColDef={{ flex: 1, resizable: true }}
        />
      </div>
    </div>
  );
}
