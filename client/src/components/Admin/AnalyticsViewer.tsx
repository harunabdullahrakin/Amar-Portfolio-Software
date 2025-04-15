import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  pageViews: Array<{
    page_path: string;
    views: number;
  }>;
  visitorsByCountry: Array<{
    country: string;
    count: number;
  }>;
  visitorsByBrowser: Array<{
    browser: string;
    count: number;
  }>;
  visitorsByOS: Array<{
    os: string;
    count: number;
  }>;
  visitorsByDevice: Array<{
    device_type: string;
    count: number;
  }>;
  recentTraffic: Array<{
    date: string;
    views: number;
  }>;
}

export default function AnalyticsViewer() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7days");
  
  const { data: analyticsData, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
    refetchInterval: 60000, // Refetch every minute
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Analytics</h3>
        <p className="text-red-600 mb-4">
          There was a problem loading your analytics data. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }
  
  // If no analytics data is available yet
  if (!analyticsData || (analyticsData && (!analyticsData.totalPageViews && !analyticsData.uniqueVisitors))) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-blue-800 mb-2">No Analytics Data Yet</h3>
        <p className="text-blue-600 mb-4">
          We haven't recorded any page views yet. As visitors browse your site, analytics data will appear here.
        </p>
        <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
          <h4 className="font-medium text-gray-700 mb-2">How to start collecting data:</h4>
          <ol className="text-left text-gray-600 space-y-2 list-decimal pl-5">
            <li>Share your website with others</li>
            <li>Visit different pages on your site</li>
            <li>Analytics are collected automatically for each page view</li>
          </ol>
        </div>
      </div>
    );
  }
  
  // At this point we know analyticsData is defined
  const data = analyticsData as AnalyticsData;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Website Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("7days")}
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === "7days" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange("30days")}
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === "30days" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Page Views</div>
          <div className="text-2xl font-bold">{data.totalPageViews.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Unique Visitors</div>
          <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Pages / Visitor</div>
          <div className="text-2xl font-bold">
            {data.uniqueVisitors > 0 
              ? (data.totalPageViews / data.uniqueVisitors).toFixed(1) 
              : "0"}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Last Updated</div>
          <div className="text-lg font-medium">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Popular Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Popular Pages</h3>
          {analyticsData.pageViews && analyticsData.pageViews.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analyticsData.pageViews.map((page: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                        {page.page_path === "/" ? "Home" : page.page_path}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 text-right">
                        {page.views}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No page view data available yet</p>
          )}
        </div>
        
        {/* Device Info */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Visitor Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Browsers</h4>
              {analyticsData.visitorsByBrowser && analyticsData.visitorsByBrowser.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.visitorsByBrowser.map((browser: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{browser.browser}</span>
                      <span className="text-sm font-medium">{browser.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No browser data yet</p>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Device Types</h4>
              {analyticsData.visitorsByDevice && analyticsData.visitorsByDevice.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.visitorsByDevice.map((device: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{device.device_type}</span>
                      <span className="text-sm font-medium">{device.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No device data yet</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Operating Systems</h4>
            {analyticsData.visitorsByOS && analyticsData.visitorsByOS.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {analyticsData.visitorsByOS.map((os: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{os.os}</span>
                    <span className="text-sm font-medium">{os.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No OS data yet</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Geographic Distribution */}
      {analyticsData.visitorsByCountry && analyticsData.visitorsByCountry.length > 0 && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {analyticsData.visitorsByCountry.map((country: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{country.country || "Unknown"}</span>
                <span className="text-sm font-medium">{country.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Embed Analytics JS */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-medium mb-4">Embed Analytics</h3>
        <p className="text-gray-600 mb-4">
          Add this JavaScript snippet to your site to automatically track page views:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-md text-sm overflow-auto">
{`<!-- Analytics Snippet -->
<script>
  (function() {
    // Track page views
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: window.location.pathname,
        referrer: document.referrer
      })
    });
  })();
</script>`}
        </pre>
        <p className="text-gray-500 text-sm mt-2">
          Note: This JavaScript is already included in your website automatically.
        </p>
      </div>
    </div>
  );
}