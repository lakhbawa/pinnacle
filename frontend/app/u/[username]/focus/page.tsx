"use client"
import {useEffect, useState} from "react";
import OutcomeOptions from "@/app/components/focus/OutcomeOptions";
import CurrentOutcome from "@/app/components/focus/CurrentOutcome";
import DriverOptions from "@/app/components/focus/DriverOptions";
import Actions from "@/app/components/focus/Actions";
import {Action, Driver, Outcome} from "@/app/types/outcomeTypes";

export default function FocusPage() {

    const [outcomes, setOutcomes] = useState<Outcome[]>([])
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [actions, setActions] = useState<Action[]>([])
    const [currentOutcome, setCurrentOutcome] = useState<Outcome | undefined>()

    const [filters, setFilters] = useState([])

    const [loading, setLoading] = useState(true)


    useEffect(() => {

    }, [])


    function selectCurrentOutcome() {

    }


    function addDriverFilter() {

    }

    function removeDriverFilter() {}


    function resetFilters() {

    }

    function resetDriversFilter() {

    }
    return (
        <>
        Focus Page

            <OutcomeOptions outcomes={outcomes}/>
            <CurrentOutcome outcome={currentOutcome}/>
            <DriverOptions drivers={drivers}/>
            <Actions actions={actions}/>
        </>
    )
}