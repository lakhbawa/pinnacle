import {Action} from "@/app/types/outcomeTypes";

export default function Actions({actions }:{ actions: Action[] }) {
    return (
        <>
        Actions
            {actions.map((action) => (
                <div key={action.id}>
                    {action.title}
                </div>
            ))}
        </>
    )
}