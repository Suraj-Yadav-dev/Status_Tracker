import { useMemo } from 'react';

const useDepartment = (userEmail) => {
  // Memoize the department extraction so it doesn't run on every render
  const userDept = useMemo(() => {
    if (!userEmail || !userEmail.includes('.')) return 'GUEST';
    // Extracts "HR" from "hr.worker@plant.com"
    return userEmail.split('.')[0].toUpperCase();
  }, [userEmail]);

  /**
   * Checks if the current user belongs to the allowed departments
   * @param {string} allowedDeptsString - e.g., "MR,HR,QUALITY"
   */
  const hasAccess = (allowedDeptsString) => {
    if (!allowedDeptsString) return false;
    const allowedArray = allowedDeptsString
      .split(',')
      .map((d) => d.trim().toUpperCase());
    return allowedArray.includes(userDept);
  };

  return {
    userDept,
    hasAccess,
    isAuthorized: (dept) => userDept === dept.toUpperCase()
  };
};

export default useDepartment;