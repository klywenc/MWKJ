import { createTheme } from '@mantine/core';

export const ifsTheme = createTheme({
    primaryColor: 'ifs-blue',
    colors: {
        'ifs-blue': [
            '#e5f2ff', '#cce5ff', '#99cbff', '#66b0ff', '#3396ff',
            '#007cff', '#005eb8', '#004a8f', '#003666', '#00213d'
        ],
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    defaultRadius: 'sm', // IFS ma dość ostre, profesjonalne rogi
});