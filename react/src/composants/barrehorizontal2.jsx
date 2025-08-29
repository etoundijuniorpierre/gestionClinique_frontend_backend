import Styled from 'styled-components'

import Recherche from './recherche'
import { Link } from 'react-router-dom';

const Barrehorizontal1Style = Styled.div`
    display: flex;
    width: 100%;
    height: 89px;
    justify-content: space-between;
`;

function Barrehorizontal2({children}){
    return(<>
        <Barrehorizontal1Style>
            <Recherche/>
            {children}
            
        </Barrehorizontal1Style>
            
    </>)
}

export default Barrehorizontal2
