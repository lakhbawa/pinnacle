import {Driver} from "@/app/types/outcomeTypes";

export default function InitiativeOptions({drivers, onAdd }:{ drivers: Driver[], onAdd: (id: string) => void }) {
    return (
        <>
        InitiativeOptions

            {drivers.map((driver) => (
                <div key={driver.id} onClick={() => onAdd(driver.id)}>
                    {driver.title}
                </div>
            ))}
        </>
    )
}