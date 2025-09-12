import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

const empty = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  state: "",
  source: "website",
  status: "new",
  score: 0,
  lead_value: 0,
  is_qualified: false,
};

export default function LeadForm() {
  const { id } = useParams();
  const [lead, setLead] = useState(empty);
  const nav = useNavigate();

  useEffect(() => {
    if (id)
      API.get(`/leads/${id}`)
        .then((r) => setLead(r.data))
        .catch(() => {});
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (id) await API.put(`/leads/${id}`, lead);
      else await API.post("/leads", lead);
      nav("/leads");
    } catch (err) {
      alert(err?.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={submit}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          {id ? "Edit Lead" : "Create New Lead"}
        </h2>

        {/* Grid layout for inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              First Name
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="John"
              value={lead.first_name}
              onChange={(e) => setLead({ ...lead, first_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Doe"
              value={lead.last_name}
              onChange={(e) => setLead({ ...lead, last_name: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="john@example.com"
              type="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Phone
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="+1 234 567 890"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Company
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Company Inc."
              value={lead.company}
              onChange={(e) => setLead({ ...lead, company: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              City
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="New York"
              value={lead.city}
              onChange={(e) => setLead({ ...lead, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              State
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="NY"
              value={lead.state}
              onChange={(e) => setLead({ ...lead, state: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Source
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white focus:ring focus:ring-blue-300 outline-none"
              value={lead.source}
              onChange={(e) => setLead({ ...lead, source: e.target.value })}
            >
              <option value="website">Website</option>
              <option value="facebook_ads">Facebook Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="referral">Referral</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Status
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white focus:ring focus:ring-blue-300 outline-none"
              value={lead.status}
              onChange={(e) => setLead({ ...lead, status: e.target.value })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
              <option value="won">Won</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Score
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              value={lead.score}
              onChange={(e) =>
                setLead({ ...lead, score: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Lead Value
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              value={lead.lead_value}
              onChange={(e) =>
                setLead({ ...lead, lead_value: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="qualified"
            className="h-4 w-4 text-blue-600"
            checked={lead.is_qualified}
            onChange={(e) =>
              setLead({ ...lead, is_qualified: e.target.checked })
            }
          />
          <label htmlFor="qualified" className="text-gray-700">
            Mark as Qualified
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => nav("/leads")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
