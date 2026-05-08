import { getReadingStatus } from '../../utils/readingStatus'

export default function ReadingStatusBadge({ status }) {
    const statusConfig = getReadingStatus(status)

    return (
        <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusConfig.badgeClass}`}
        >
            {statusConfig.label}
        </span>
    )
}
