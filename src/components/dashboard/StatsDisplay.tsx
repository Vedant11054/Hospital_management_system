import { Users, Building2 } from 'lucide-react';

interface StatsDisplayProps {
  totalUsers?: number;
  totalHospitals?: number;
}

export const StatsDisplay = ({ totalUsers = 0, totalHospitals = 0 }: StatsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Total Users Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{totalUsers}</p>
          </div>
          <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Hospitals Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Total Hospitals</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{totalHospitals}</p>
          </div>
          <div className="bg-green-500 bg-opacity-20 p-3 rounded-full">
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
