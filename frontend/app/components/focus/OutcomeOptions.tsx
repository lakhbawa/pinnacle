import {Outcome} from "@/app/types/outcomeTypes";

export default function OutcomeOptions({outcomes, onSelect }:{ outcomes: Outcome[], onSelect: (id: string) => void }) {
    return (
        <>
            {outcomes.map((outcome) => (
                <div key={outcome.id} onClick={() => onSelect(outcome.id)}>
                    {outcome.title}
                </div>
            ))}
        </>
    )
}