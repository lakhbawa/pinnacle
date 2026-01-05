"use client"
import {useEffect, useState, useMemo} from "react";
import OutcomeOptions from "@/app/components/focus/OutcomeOptions";
import CurrentOutcome from "@/app/components/focus/CurrentOutcome";
import DriverOptions from "@/app/components/focus/DriverOptions";
import Actions from "@/app/components/focus/Actions";
import {Action, Driver, Outcome} from "@/app/types/outcomeTypes";
import {outcomeAPI} from "@/utils/fetchWrapper";

interface ListOutcomesResponse {
    data: Outcome[];
}

export default function FocusPage() {

    const [outcomes, setOutcomes] = useState<Outcome[]>([])
    const [allActions, setAllActions] = useState<Action[]>([]) // Store all actions from API
    const [currentOutcome, setCurrentOutcome] = useState<Outcome | undefined>()

    const [filters, setFilters] = useState<{
        outcome_id: string;
        driver_ids: string[];
    }>({
        outcome_id: '',
        driver_ids: [],
    })

    const [loading, setLoading] = useState(true)

    const username = 'lakhbawa'

    const drivers = currentOutcome?.drivers ?? []

    const actions = useMemo(() => {
    if (!currentOutcome || filters.driver_ids.length === 0) {
        return []
    }

    return currentOutcome.drivers
        .filter(driver => filters.driver_ids.includes(driver.id))
        .flatMap(driver => driver.actions)
}, [currentOutcome, filters.driver_ids])

    useEffect(() => {
        outcomeAPI.get<ListOutcomesResponse>('/focus/' + username, {
            params: {user_id: 'user-123', page_size: 20}
        })
            .then((response) => {
                console.log('response', response);
                setOutcomes(response.data);
                // TODO: You may need to fetch actions separately or extract from response
            })
            .catch((error) => {
                console.error('Failed to fetch outcomes:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])


    function selectCurrentOutcome(id: string) {
        const outcome = outcomes.find(o => o.id === id)
        setCurrentOutcome(outcome)
        setFilters(prev => ({
            ...prev,
            outcome_id: id,
            driver_ids: []
        }))
    }

    function addDriverFilter(id: string) {
        setFilters(prev => ({
            ...prev,
            driver_ids: [...prev.driver_ids, id]
        }))
    }

    function removeDriverFilter() {
        setFilters(prev => ({
            ...prev,
            driver_ids: prev.driver_ids.slice(0, -1)
        }))
    }

    function resetFilters() {
        setFilters({outcome_id: '', driver_ids: []})
        setCurrentOutcome(undefined)
    }

    function resetDriversFilter() {
        setFilters(prev => ({...prev, driver_ids: []}))
    }

    return (
        <>
            Focus Page

            <OutcomeOptions outcomes={outcomes} onSelect={selectCurrentOutcome} />
            <CurrentOutcome outcome={currentOutcome}/>
            <DriverOptions drivers={drivers} onAdd={addDriverFilter} />
            <Actions actions={actions}/>
        </>
    )
}