import React from "react";
import ActivitiesTableClient from "@/components/Activities/ActivitiesTableClient";
import { Plus } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-10 lg:p-12 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Activities <span className="text-indigo-600">Management</span>
            </h1>
            <p className="max-w-2xl text-lg font-medium text-gray-500">
              Curate and manage your hotel's premium experiences and local adventures.
            </p>
          </div>

          <button className="group flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            <span className="uppercase tracking-widest">Add Activity</span>
          </button>
        </header>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-[40px] bg-white p-4 shadow-2xl shadow-black/10 ring-1 ring-gray-100">
            <ActivitiesTableClient />
          </section>
        </div>
      </div>
    </div>
  );
}
