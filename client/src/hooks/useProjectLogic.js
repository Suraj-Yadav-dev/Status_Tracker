import { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

/**
 * Custom hook to consume the Project Context.
 * Provides: data, updateStatus, checkAccess, userEmail
 */
const useProjectLogic = () => {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  return context;
};

export default useProjectLogic;