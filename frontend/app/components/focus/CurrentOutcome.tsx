import {Outcome} from "@/app/types/outcomeTypes";

export default function CurrentOutcome({outcome }:{ outcome: Outcome | undefined }) {
    return (
        <>
        CurrentOutcome
            outcome : {outcome?.title}
        </>
    )
}