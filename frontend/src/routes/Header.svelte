<script>
    import {Icon,ButtonDropdown, Dropdown, DropdownItem,DropdownMenu,DropdownToggle,Nav,NavItem,NavLink,} from "sveltestrap";
    let isOpen = false;
</script>

<div class="header-wrapper">
    <h2>SOS2223-<span class="accent-color">jul-vse</span></h2>

    <Nav style="display: flex;">
        <NavLink href="/" class="nav-link" style="margin-right: 20px;" ><h6 style="font-weight:bold;  color:black; font-size: 18px;">Inicio</h6> <Icon name="house-fill"/></NavLink>

        <NavItem>
            <Dropdown nav {isOpen} toggle={() => (isOpen = !isOpen)}>
                <DropdownToggle nav caret style="font-weight:bold; color:black; font-size: 18px;">Precios</DropdownToggle>
                <DropdownMenu>
                <DropdownItem><a href="/agroprices-weekly">Página de Inicio</a></DropdownItem>
                <DropdownItem divider/>
                <DropdownItem><a href="/agroprices-weekly/graphs">Grafos</a></DropdownItem>     
                <DropdownItem divider/>
                <DropdownItem><a href="/integrations">Integraciones y Usos</a></DropdownItem>                     
            </DropdownMenu>
            </Dropdown>

        </NavItem>

        <NavItem>
            <Dropdown nav>
                <DropdownToggle nav caret style="font-weight:bold; color:black; font-size: 18px;">Integraciones y Usos</DropdownToggle>
                <DropdownMenu>
                <DropdownItem><a href="/integrations/withproxy">Integración Con Proxy</a></DropdownItem>
                <DropdownItem divider/>
                <DropdownItem><a href="/integrations/withoutproxy">Integración Sin Proxy</a></DropdownItem>     
                <DropdownItem divider/>
                <DropdownItem><a href="/integrations/usoaliexpress">Widget AliExpress</a></DropdownItem>  
                <DropdownItem divider/>
                <DropdownItem><a href="/integrations/usohomiciderate">Widget Homicidios</a></DropdownItem>  
                <DropdownItem divider/>
                <DropdownItem><a href="/integrations/usocurrency">Widget Moneda</a></DropdownItem>  
                <DropdownItem divider/>
                <DropdownItem><a href="/integrations/usoamazon">Widget Amazon</a></DropdownItem>  
              </DropdownMenu>
            </Dropdown>

        </NavItem>
        <NavLink href="/about" class="nav-link" style="margin-right: 20px;" ><h6 style="font-weight:bold;  color:black; font-size: 18px;">Acerca De</h6> <Icon name="house-fill"/></NavLink>

    </Nav>
</div>

<style>
    .header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #e8a8a8;
        color: #ffffff;
        padding: 20px; 
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 0.05em;
    }
    .accent-color {
        color: #ff0000;
    }
    a {
        color: #000000;
        text-decoration: none;
        font-weight: bold;
    }

</style>
