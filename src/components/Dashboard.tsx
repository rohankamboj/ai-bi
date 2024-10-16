import React, { useEffect, useState } from 'react';
import { Layout, Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { FaEdit, FaPlus, FaThumbtack, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';
import ChatbotIcon from './common/ChatbotIcon';
import Popup from './common/Popup';

import { DashboardConfig, updateDashboard } from '../store/dashboardSlice';
import AdvancedBarChart from './charts/BarChart';
import HeatMapChart from './charts/HeatMapChart';
import AdvancedLineChart from './charts/LineChart';
import AdvancedPieChart from './charts/PieChart';
import AdvancedRadarChart from './charts/RadarChart';
import AdvancedInteractiveMap from './maps/AdvancedInteractiveMap';

interface DynamicComponent {
  id: string;
  type: string;
  title: string;
  data: any[];
  dataKeys?: string[];
  xAxisDataKey?: string;
  nameKey?: string;
  latitudeField?: string;
  longitudeField?: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const dashboardConfig = useSelector((state: RootState) =>
    state.dashboard.dashboards.find((d) => d.id === state.ui.activeDashboardId)
  ) as DashboardConfig;
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const agents = useSelector(
    (state: RootState) => state.user.user?.agents || []
  );
  const datasources = useSelector(
    (state: RootState) => state.dataSource.dataSources
  );

  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [selectedDatasource, setSelectedDatasource] = useState<string | null>(
    null
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<string | null>(
    null
  );
  const [availableValues, setAvailableValues] = useState<string[]>([]);
  const [editingChart, setEditingChart] = useState<string | null>(null);
  const [isAssignAgentModalOpen, setIsAssignAgentModalOpen] = useState(false);
  const [selectedLatitudeField, setSelectedLatitudeField] =
    useState<string>('');
  const [selectedLongitudeField, setSelectedLongitudeField] =
    useState<string>('');

  // useEffect(() => {
  //   if (token) {
  //     dispatch(fetchUserDetails() as any);
  //   }
  // }, [dispatch, token]);

  useEffect(() => {
    if (selectedDatasource) {
      const selectedSource = datasources.find(
        (ds) => ds.id === selectedDatasource
      );
      if (
        selectedSource &&
        selectedSource.data &&
        selectedSource.data.length > 0
      ) {
        // Function to flatten and extract keys from nested structures
        const extractKeys = (obj: any): string[] => {
          if (Array.isArray(obj)) {
            return obj.flatMap(extractKeys);
          } else if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj).flatMap(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return [key, ...extractKeys(value)];
              }
              return key;
            });
          }
          return [];
        };

        const allKeys = new Set(extractKeys(selectedSource.data));
        setAvailableValues(Array.from(allKeys));
      } else {
        setAvailableValues([]);
      }
    }
  }, [selectedDatasource, datasources]);

  const handleDatasourceChange = (datasourceId: string) => {
    setSelectedDatasource(datasourceId);
  };

  const handleAddModuleConfirm = () => {
    if (
      !selectedDatasource ||
      selectedValues.length === 0 ||
      !selectedChartType
    ) {
      console.error('Please select datasource, values, and chart type');
      return;
    }

    const selectedSource = datasources.find(
      (ds) => ds.id === selectedDatasource
    );
    if (!selectedSource) {
      console.error('Selected datasource not found');
      return;
    }

    // Flatten nested data if it exists
    let flattenedData = selectedSource.data.flatMap((item) =>
      Array.isArray(item.portfolioData) ? item.portfolioData : item
    );

    let chartData = flattenedData;
    let dataKeys = selectedValues;
    let xAxisDataKey = selectedValues[0];
    let nameKey = selectedValues[0];

    // Process data based on chart type
    switch (selectedChartType) {
      case 'line':
      case 'bar':
        if (selectedValues.length < 2) {
          alert('Please select at least two values for line or bar charts');
          return;
        }
        chartData = flattenedData.map((item) => {
          const newItem: { [key: string]: any } = {};
          selectedValues.forEach((value) => {
            newItem[value] = item[value];
          });
          return newItem;
        });
        break;
      case 'heatmap':
        if (selectedValues.length !== 3) {
          alert(
            'Please select exactly three values for heatmap: x, y, and value'
          );
          return;
        }
        chartData = flattenedData.map((item) => ({
          x: item[selectedValues[0]],
          y: item[selectedValues[1]],
          value: item[selectedValues[2]],
        }));
        break;
      case 'radar':
        if (selectedValues.length < 3) {
          alert('Please select at least three values for radar chart');
          return;
        }
        break;
      case 'map':
        if (!selectedLatitudeField || !selectedLongitudeField) {
          alert('Please select fields for latitude and longitude');
          return;
        }
        chartData = flattenedData.map((item) => ({
          ...item,
          [selectedLatitudeField]: parseFloat(item[selectedLatitudeField]),
          [selectedLongitudeField]: parseFloat(item[selectedLongitudeField]),
        }));
        break;
      case 'pie':
        if (selectedValues.length !== 2) {
          alert(
            'Please select exactly two values for pie chart: name and value'
          );
          return;
        }
        chartData = flattenedData.map((item) => ({
          [selectedValues[0]]: item[selectedValues[0]],
          [selectedValues[1]]: parseFloat(item[selectedValues[1]]),
        }));
        nameKey = selectedValues[0];
        dataKeys = [selectedValues[1]];
        break;
      default:
        console.error('Unsupported chart type');
        return;
    }

    const newComponent: DynamicComponent = {
      id: `module_${uuidv4()}`,
      type: selectedChartType,
      title: `${
        selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)
      } Chart - ${selectedSource.name}`,
      data: chartData,
      dataKeys,
      xAxisDataKey,
      nameKey,
      latitudeField: selectedLatitudeField,
      longitudeField: selectedLongitudeField,
    };

    const newLayout: Layout = {
      i: newComponent.id,
      x: 0,
      y: Infinity,
      w: 12, // Full width
      h: 24, // Increased height
      minW: 3,
      maxW: 12,
      minH: 4,
      maxH: Infinity,
      static: false,
    };

    dispatch(
      updateDashboard({
        ...dashboardConfig,
        dynamicComponents: [...dashboardConfig.dynamicComponents, newComponent],
        layouts: {
          ...dashboardConfig.layouts,
          lg: [...(dashboardConfig.layouts.lg || []), newLayout],
        },
      })
    );

    setIsAddModuleModalOpen(false);
    resetModalState();
  };

  const resetModalState = () => {
    setSelectedDatasource(null);
    setSelectedValues([]);
    setSelectedChartType(null);
  };

  const renderChart = (component: DynamicComponent) => {
    return (
      <div className='h-full'>
        {(() => {
          switch (component.type) {
            case 'line':
              return (
                <AdvancedLineChart
                  data={component.data}
                  dataKeys={component.dataKeys!}
                  xAxisDataKey={component.xAxisDataKey!}
                />
              );
            case 'bar':
              return (
                <AdvancedBarChart
                  data={component.data}
                  dataKeys={component.dataKeys!}
                  xAxisDataKey={component.xAxisDataKey!}
                />
              );
            case 'heatmap':
              return (
                <HeatMapChart
                  data={component.data}
                  xLabel={component.dataKeys![0]}
                  yLabel={component.dataKeys![1]}
                  valueLabel={component.dataKeys![2]}
                />
              );
            case 'radar':
              return (
                <AdvancedRadarChart
                  data={component.data}
                  dataKeys={component.dataKeys!}
                  nameKey={component.xAxisDataKey!}
                />
              );
            case 'map':
              return (
                <AdvancedInteractiveMap
                  markers={component.data}
                  latitudeField={component.latitudeField!}
                  longitudeField={component.longitudeField!}
                />
              );
            case 'pie':
              return (
                <AdvancedPieChart
                  data={component.data}
                  dataKey={component.dataKeys![0]}
                  nameKey={component.nameKey!}
                />
              );
            default:
              return <div>Unsupported chart type</div>;
          }
        })()}
      </div>
    );
  };

  const renderDynamicComponents = () => {
    return dashboardConfig.dynamicComponents.map((component) => (
      <div key={component.id} className='w-full h-full'>
        <div className='relative bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-full'>
          <div className='flex justify-between items-center mb-2 drag-handle cursor-move'>
            <h2 className='text-lg font-semibold text-blue-400'>
              {component.title}
            </h2>
            <div className='flex space-x-2'>
              <button
                onClick={() => setEditingChart(component.id)}
                className='no-drag text-gray-300 hover:text-blue-500'
                title='Edit Module'
              >
                <FaEdit />
              </button>
              <button
                onClick={() => togglePin(component.id)}
                className='no-drag text-gray-300 hover:text-blue-500'
                title={
                  dashboardConfig.lockedComponents.includes(component.id)
                    ? 'Unpin Module'
                    : 'Pin Module'
                }
              >
                <FaThumbtack
                  className={`${
                    dashboardConfig.lockedComponents.includes(component.id)
                      ? 'text-blue-500'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
              <button
                onClick={() => handleDeleteModule(component.id)}
                className='no-drag text-gray-300 hover:text-red-500'
                title='Delete Module'
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <div className='flex-grow text-gray-300 h-full'>
            {editingChart === component.id
              ? renderEditForm(component.id)
              : renderChart(component)}
          </div>
        </div>
      </div>
    ));
  };

  const handleDeleteModule = (id: string) => {
    dispatch(
      updateDashboard({
        ...dashboardConfig,
        dynamicComponents: dashboardConfig.dynamicComponents.filter(
          (c) => c.id !== id
        ),
        layouts: {
          ...dashboardConfig.layouts,
          lg: dashboardConfig.layouts.lg.filter((item) => item.i !== id),
        },
      })
    );
  };

  const togglePin = (id: string) => {
    const isCurrentlyLocked = dashboardConfig.lockedComponents.includes(id);
    const updatedLockedComponents = isCurrentlyLocked
      ? dashboardConfig.lockedComponents.filter(
          (componentId) => componentId !== id
        )
      : [...dashboardConfig.lockedComponents, id];

    const updatedLayouts = { ...dashboardConfig.layouts };
    for (const breakpoint in updatedLayouts) {
      if (updatedLayouts.hasOwnProperty(breakpoint)) {
        updatedLayouts[breakpoint] = updatedLayouts[breakpoint].map(
          (layoutItem) => {
            if (layoutItem.i === id) {
              return { ...layoutItem, static: !isCurrentlyLocked };
            }
            return layoutItem;
          }
        );
      }
    }

    dispatch(
      updateDashboard({
        ...dashboardConfig,
        lockedComponents: updatedLockedComponents,
        layouts: updatedLayouts,
      })
    );
  };

  const renderEditForm = (componentId: string) => {
    // Implement the edit form for the chart
    return <div>Edit form placeholder</div>;
  };

  const handleAssignAgent = (agentId: string) => {
    const selectedAgent = agents.find((agent) => agent.id === agentId);
    if (selectedAgent) {
      dispatch(
        updateDashboard({
          ...dashboardConfig,
          agent: { ...selectedAgent, name: selectedAgent.id },
        })
      );
    }
    setIsAssignAgentModalOpen(false);
  };

  return (
    <div className='flex-grow h-screen p-4 overflow-x-hidden bg-gray-900'>
      <ResponsiveGridLayout
        className='layout'
        layouts={dashboardConfig.layouts}
        isResizable={true}
        isDraggable={true}
        onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
          // Prevent dragging if the item is locked
          const isLocked = dashboardConfig.lockedComponents.includes(oldItem.i);
          if (isLocked) {
            e.preventDefault();
          }
        }}
        rowHeight={30}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        margin={[20, 20]}
        containerPadding={[20, 20]}
        draggableCancel='.no-drag'
        onLayoutChange={(currentLayout, allLayouts) =>
          dispatch(
            updateDashboard({
              ...dashboardConfig,
              layouts: allLayouts,
            })
          )
        }
        draggableHandle='.drag-handle'
        autoSize={false} // Disable auto-sizing
        verticalCompact={false} // Disable vertical compaction
        style={{ height: '100%' }} // Ensure the grid fills the container
      >
        {renderDynamicComponents()}
      </ResponsiveGridLayout>

      <button
        onClick={() => setIsAddModuleModalOpen(true)}
        className='fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors'
        title='Add Module'
      >
        <FaPlus size={20} />
      </button>

      <ChatbotIcon
        onPinMessage={() => {}}
        dashboardConfig={dashboardConfig}
        onAssignAgent={() => setIsAssignAgentModalOpen(true)}
        user={user}
      />

      {isAddModuleModalOpen && (
        <Popup
          isOpen={isAddModuleModalOpen}
          onClose={() => setIsAddModuleModalOpen(false)}
          title='Add New Chart'
        >
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300'>
                Select Datasource
              </label>
              <select
                value={selectedDatasource || ''}
                onChange={(e) => handleDatasourceChange(e.target.value)}
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white'
              >
                <option value=''>Select a datasource</option>
                {datasources.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300'>
                Select Values
              </label>
              <select
                multiple
                value={selectedValues}
                onChange={(e) =>
                  setSelectedValues(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white'
              >
                {availableValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300'>
                Select Chart Type
              </label>
              <select
                value={selectedChartType || ''}
                onChange={(e) => setSelectedChartType(e.target.value)}
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white'
              >
                <option value=''>Select a chart type</option>
                <option value='line'>Line Chart</option>
                <option value='bar'>Bar Chart</option>
                <option value='heatmap'>Heatmap</option>
                <option value='radar'>Radar Chart</option>
                <option value='map'>Map</option>
                <option value='pie'>Pie Chart</option>
              </select>
            </div>
            {selectedChartType === 'map' && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-300'>
                    Select Latitude Field
                  </label>
                  <select
                    value={selectedLatitudeField}
                    onChange={(e) => setSelectedLatitudeField(e.target.value)}
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white'
                  >
                    <option value=''>Select field for latitude</option>
                    {availableValues.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300'>
                    Select Longitude Field
                  </label>
                  <select
                    value={selectedLongitudeField}
                    onChange={(e) => setSelectedLongitudeField(e.target.value)}
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white'
                  >
                    <option value=''>Select field for longitude</option>
                    {availableValues.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className='flex justify-end'>
              <button
                onClick={handleAddModuleConfirm}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              >
                Add Chart
              </button>
            </div>
          </div>
        </Popup>
      )}

      {isAssignAgentModalOpen && (
        <Popup
          isOpen={isAssignAgentModalOpen}
          onClose={() => setIsAssignAgentModalOpen(false)}
          title='Assign Agent'
        >
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300'>
                Select Agent
              </label>
              <select
                onChange={(e) => handleAssignAgent(e.target.value)}
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white'
              >
                <option value=''>Select an agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.agent_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Dashboard;
