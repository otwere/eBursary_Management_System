
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Banknote, PieChart } from "lucide-react";

interface ApplicationStats {
  total: number;
  pendingAllocation: number;
  allocatedToday: number;
  totalAmount: number;
  percentChange?: number;
}

interface StatCardsProps {
  stats: ApplicationStats;
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xl font-bold -mt-2">{stats.total}</div>
              <p className="text-xs text-gray-500">Pending Allocation</p>
            </div>
            <div className="rounded-full p-2 bg-blue-100">
              <PieChart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-amber-500 bg-amber-50 hover:bg-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Pending Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xl font-bold -mt-2">{stats.pendingAllocation}</div>
              <p className="text-xs text-gray-500">Awaiting Fund Allocation</p>
            </div>
            <div className="rounded-full p-2 bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Allocated Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xl font-bold -mt-2">{stats.allocatedToday}</div>
              <div className="flex items-center text-xs text-green-600">
                {stats.percentChange && stats.percentChange > 0 ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{stats.percentChange}% from yesterday</span>
                  </>
                ) : (
                  <span>Successful Allocations</span>
                )}
              </div>
            </div>
            <div className="rounded-full p-2 bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500 bg-purple-50 hover:bg-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xl font-bold -mt-2">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-xs text-gray-500">Requested Funding</p>
            </div>
            <div className="rounded-full p-2 bg-purple-100">
              <Banknote className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
