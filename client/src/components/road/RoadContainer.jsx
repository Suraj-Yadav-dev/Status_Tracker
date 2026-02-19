import React from 'react';
import { useProject } from '../../context/ProjectContext';
import StageNode from './StageNode';
import '../../assets/styles/road-animation.css';

const RoadContainer = () => {
  // 1. Pull dynamic 'user' instead of 'userEmail'
  const { data, user } = useProject();

  // 2. Logic: Check if any part of the project is currently in progress
  const isAnyStageActive = data.some(stage => 
    stage.currentStatus === "Active" || 
    stage.substages.some(sub => sub.currentStatus === "Active")
  );

  return (
    <div className="horizontal-road-wrapper">
      <div className="horizontal-stages-track">
        {data.map((stage, index) => (
          <React.Fragment key={stage.id}>
            {/* The Stage Card */}
            <StageNode 
              stage={stage} 
              // StageNode will now internally use 'user' from context
            />

            {/* 3. The Connector: Show a bridge between stages (except after the last one) */}
            {index < data.length - 1 && (
              <div className={`stage-connector ${
                // Logic: Bridge moves if the current stage is Active or Completed
                stage.currentStatus === "Active" || stage.currentStatus === "Completed" 
                ? 'moving' 
                : ''
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RoadContainer;