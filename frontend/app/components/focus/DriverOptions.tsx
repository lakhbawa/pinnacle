import {Driver} from "@/app/types/outcomeTypes";

export default function DriverOptions({drivers, onAdd }:{ drivers: Driver[], onAdd: (id: string) => void }) {
    return (
        <>
        DriverOptions

            {drivers.map((driver) => (
                <div key={driver.id} onClick={() => onAdd(driver.id)}>
                    {driver.title}
                </div>
            ))}
        </>
    )
}