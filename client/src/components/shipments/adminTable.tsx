import React, { useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table'
import { getAllShipmentsAdmin } from '@/app/api/services/shipping/api'
import BgBlurLoader from '../bgBlurLoader'
import { useShipIDContext } from '@/contextApi/shipIDState'
import { useRouter } from 'next/navigation'

interface ShippingItem {
  shippingId: string
  senderAddress: string
  receiverFirstName: string
  receiverLastName: string
  receiverAddress: string
  receiverTelephone: string
  status: 'PENDING' | 'COLLECTED' | 'SHIPPED' | 'COMPLETED' | 'CANCELED' | 'ON_ROUTE_TO_COLLECT'
  requestCancel: boolean
  placedDate: string
  collectedDate: string | null
  shippedDate: string | null
  completedDate: string | null
  canceledDate: string | null
  delayFlag: boolean
  weight: number
  notifications: Notification[]
  user: User
}

export interface Notification {
  id: number
  title: string
  description: string
  date: string
  viewed: boolean
  userId?: number
  shipmentId?: number
}

export interface User {
  firstName: string
  lastName: string
  email: string
  address?: string
  telephone?: string
  password?: string
}

type ShippingData = {
  ReturnMessage: {
    shippingItems: ShippingItem[]
  }
}

const AdminTable: React.FC = () => {
  const { setNewID } = useShipIDContext();
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<ShippingData, Error>({
    queryKey: ['adminShipments'],
    queryFn: () => getAllShipmentsAdmin(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const shipments = data?.ReturnMessage.shippingItems ?? []

  const handleView = useCallback((item: ShippingItem) => {
    setNewID(item.shippingId);
    router.push('/view_shipment');
  }, [])

  const columns = useMemo<MRT_ColumnDef<ShippingItem>[]>(
    () => [
      { accessorKey: 'shippingId', header: 'Shipping ID' },
      { accessorKey: 'senderAddress', header: 'Sender' },
      {
        header: 'Receiver Name',
        accessorFn: ({ receiverFirstName, receiverLastName }) =>
          `${receiverFirstName} ${receiverLastName}`,
        id: 'receiverName',
      },
      { accessorKey: 'receiverAddress', header: 'Receiver Address' },
      { accessorKey: 'status', header: 'Status' },
      {
        accessorKey: 'placedDate',
        header: 'Placed At',
        filterFn: (row, columnId, filterValue) => {
          if (
            !filterValue ||
            !Array.isArray(filterValue) ||
            filterValue.length !== 2 ||
            (!filterValue[0] && !filterValue[1])
          ) {
            return true
          }
          const cellTs = new Date(row.getValue<string>(columnId)).getTime()
          const [min, max] = filterValue.map((v: string) =>
            v ? new Date(v).getTime() : null
          )
          if (min !== null && cellTs < min) return false
          if (max !== null && cellTs > max) return false
          return true
        },
        Filter: ({ column }) => {
          const filterValue = (column.getFilterValue() as string[] | undefined) ?? [
            '',
            '',
          ]
          return (
            <div className="flex space-x-2">
              <input
                type="datetime-local"
                className="border p-1 rounded text-sm"
                value={filterValue[0]}
                onChange={(e) =>
                  column.setFilterValue([e.target.value, filterValue[1]])
                }
              />
              <input
                type="datetime-local"
                className="border p-1 rounded text-sm"
                value={filterValue[1]}
                onChange={(e) =>
                  column.setFilterValue([filterValue[0], e.target.value])
                }
              />
            </div>
          )
        },
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleString(),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableColumnActions: false,
        enableSorting: false,
        enableEditing: false,
        Cell: ({ row }) => (
          <button
            onClick={() => handleView(row.original)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            View
          </button>
        ),
      },
    ],
    [handleView],
  )

  return (
    <div className="mt-28 flex flex-col items-center w-full">
      {isError && (
        <div className="text-red-500 flex items-center justify-center w-full text-xl">
          Failed to load shipments.
        </div>
      )}
      {isLoading && <BgBlurLoader />}

      <h1 className="text-2xl font-bold mb-4">All Shipments</h1>

      <div className="w-full overflow-x-auto m-4">
        <MaterialReactTable
          columns={columns}
          data={shipments}
          initialState={{ showColumnFilters: true }}
          muiTablePaperProps={{
            sx: {
              width: '100%',
            },
          }}
          muiTableContainerProps={{
            sx: {
              maxWidth: '100%',
              overflowX: 'auto',
            },
          }}
        />
      </div>
    </div>
  )
}

export default AdminTable
