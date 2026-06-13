workspace "Apex Operational Systems - Current State" {

    model {
        operationsTeam = person "Operations Team" "Fulfilment centre users and operations staff."
        supportTeam = person "Support Team" "Technical support team responding to incidents and operational failures."

        externalSystems = softwareSystem "External Customer Systems" "External customer, ERP or host systems that submit orders and fulfilment demand."
        platform = softwareSystem "Order Fulfilment Platform" "Core fulfilment platform responsible for host integration, task generation, stock allocation, workflow orchestration and robotic fulfilment coordination."

        database = softwareSystem "SQL Operational Database" "Stores orders, stock, tasks, movements, fulfilment events and operational state."
        reporting = softwareSystem "Reporting Services" "Provides operational and management reporting."

        rabbitmq = softwareSystem "RabbitMQ Messaging Broker" "Message broker supporting asynchronous communication between fulfilment services and downstream systems."
        robotControl = softwareSystem "Robot Control System" "Receives fulfilment tasks and sends work instructions to robotic systems."
        robots = softwareSystem "Robotic Fulfilment Fleet" "Robotic systems responsible for automated movement and fulfilment execution."

        elastic = softwareSystem "Elastic Log Search" "Log search capability used by support teams during operational investigation."

        supportModel = softwareSystem "Operational Support Model" "Manual operational support model covering incident reporting, investigation, patching, service restart and recovery activities."
        manualMonitoring = softwareSystem "Manual Monitoring" "Issues are usually detected by site users after service degradation or failure."
        manualPatching = softwareSystem "Manual Patching" "Patching and service recovery activities are manually coordinated."
        manualRecovery = softwareSystem "Manual Recovery" "Failover, service restart and recovery processes depend on support intervention."

        operationsTeam -> externalSystems "Submits and manages fulfilment demand"
        externalSystems -> platform "Sends orders and fulfilment instructions"

        platform -> database "Reads/writes orders, stock, tasks and fulfilment state"
        database -> reporting "Provides reporting data"

        platform -> rabbitmq "Publishes operational events and robot task messages"
        rabbitmq -> robotControl "Sends task and movement instructions"
        robotControl -> robots "Dispatches robotic jobs"

        platform -> elastic "Writes operational logs and events"

        supportTeam -> elastic "Searches logs during incidents"
        supportTeam -> database "Investigates SQL timeouts and reporting failures"
        supportTeam -> rabbitmq "Investigates queue backlogs"
        supportTeam -> robotControl "Investigates robot task idling"

        supportTeam -> supportModel "Coordinates operational incident response"
        supportModel -> manualMonitoring "Relies on site-reported incidents"
        supportModel -> manualPatching "Coordinates manual patching and service restarts"
        supportModel -> manualRecovery "Coordinates manual failover and recovery"
    }

    views {
        systemLandscape "Current-State-Master" {
            include *
            autoLayout lr
            title "Current-State Fulfilment Platform Architecture"
            description "Legacy operational platform with tightly coupled fulfilment services, manual recovery, limited observability and reactive support processes."
        }

        styles {
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }

            element "Software System" {
                background #1168bd
                color #ffffff
            }
        }

        theme default
    }
}
