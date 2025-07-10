import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function GraficoMedidas({ data }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="peso" stroke="#8884d8" />
          <Line type="monotone" dataKey="cintura" stroke="#82ca9d" />
          <Line type="monotone" dataKey="brazo" stroke="#ffc658" />
          {/* Puedes agregar más líneas aquí */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoMedidas;
