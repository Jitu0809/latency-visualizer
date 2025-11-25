import { RootState } from '@/src/store/store';
import React from 'react'
import { useSelector } from 'react-redux';

export function UserLocationDetails({ style }: { style?: React.CSSProperties }){
  const userLocation = useSelector((state: RootState) => state.userLocation);

  return (
    <div style={{
      position: "absolute",
      top: 12,
      left: 12,
      background: "rgba(255,255,255,0.1)",
      color: "white",
      padding: "10px 12px",
      borderRadius: 8,
      fontSize: 16,
      zIndex: 20,
      backdropFilter: 'blur(10px)',
      ...style
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>User Details</div>
      <p style={{ fontSize: 18 }}><strong>{userLocation.asOrganization}</strong></p>
      <p>Location: {userLocation.city}, {userLocation.country}</p>
      <p>Host: {userLocation.hostname}</p>
      <p>Lat: {userLocation.latitude?.toFixed(4)}, Lon: {userLocation.longitude?.toFixed(4)}</p>
    </div>
  );
}