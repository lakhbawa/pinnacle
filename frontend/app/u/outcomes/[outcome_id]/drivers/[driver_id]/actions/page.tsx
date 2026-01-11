'use client'
import Link from "next/link";
import {use, useEffect, useState} from "react";
import { outcomeAPI } from "@/utils/fetchWrapper";

interface Action {
  id: string;
  title: string;
  user_id: string;
  why_it_matters: string;
  success_metric_value: number;
  success_metric_unit: string;
  status: string;
}

interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  next_page?: string;
}

interface ListActionsResponse {
  success: boolean;
  data: Action[];
  meta: Meta;
}

export default function Actions({params}: { params: Promise<{ driver_id: string,outcome_id: string }> }) {
  const [actions, setActions] = useState<Action[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const {outcome_id, driver_id} = use(params);


  useEffect(() => {
    outcomeAPI.get<ListActionsResponse>('/actions', {
      params: { outcome_id: outcome_id,driver_id: driver_id, page_size: 20 }
    })
      .then((response) => {
        setActions(response.data);
        setMeta(response.meta);
      })
      .catch((error) => {
        console.error('Failed to fetch actions:', error);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  const deleteAction = (id: string) => async () => {
    console.log("deleting action", id);
    const confirmed = confirm("Are you sure you want to delete this action?")
    if (confirmed) {
      try {
        await outcomeAPI.delete(`/actions/${id}`)
        setActions(actions.filter(p => p.id !== id))
        console.log('Action deleted successfully')
      } catch (error) {
        console.error('Failed to delete action:', error)
        alert('Failed to delete outcome')
      }
    }
  }

  if (loading) return <div className="p-4">Loading actions...</div>

  return (
    <>
      <section className="container mx-auto p-4">

        <h1 className="p-4 font-bold bg-primary-600 text-white">Your Actions</h1>

        {meta && (
          <p className="text-sm text-gray-600 p-2">
            Showing {actions.length} of {meta.total} actions
          </p>
        )}

        <section className="bg-gray-200 p-3">
          <section className="grid overflow-x-auto gap-3 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {actions.length === 0 ? (
              <div className="p-4 text-gray-500">No actions yet. Create your first one!</div>
            ) : (
              actions.map((action) => (
                <div
                  className="px-4 py-5 min-w-[200px] rounded bg-primary-200 border-2 border-primary-300 flex flex-row items-start justify-between"
                  key={action.id}>
                  <div className="pb-6">
                    <Link href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/${action.id}`}
                          className="font-semibold text-primary-600">
                      {action.title}
                    </Link>
                  </div>
                  <div className="actions flex gap-3">
                    <Link href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/${action.id}/update`}
                          className="font-medium bg-blue-500 p-2 shadow-2xl text-white rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                           strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                      </svg>
                    </Link>
                    <button
                      onClick={deleteAction(action.id)}
                      className="font-medium bg-red-500 p-2 shadow-2xl text-white rounded cursor-pointer hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                           strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </section>

        <Link href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/create`}
              className="font-medium bg-blue-500 p-3 my-3 inline-block shadow-2xl text-white rounded">
          Create Action
        </Link>
      </section>
    </>
  )
}