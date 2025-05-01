<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize input
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $date = filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING);
    $time = filter_input(INPUT_POST, 'time', FILTER_SANITIZE_STRING);
    $guests = filter_input(INPUT_POST, 'guests', FILTER_SANITIZE_STRING);
    $special_requests = filter_input(INPUT_POST, 'special-requests', FILTER_SANITIZE_STRING);
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($date) || empty($time) || empty($guests)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Validate date is in the future
    $reservation_datetime = new DateTime("$date $time");
    $now = new DateTime();
    if ($reservation_datetime < $now) {
        echo json_encode(['success' => false, 'message' => 'Reservation date must be in the future']);
        exit;
    }
    
    // Recipient email (should be configured in production)
    $to = "reservations@yourdomain.com";
    $subject = "New Table Reservation from $name";
    
    // Email headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Email body
    $email_body = "New table reservation request:\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Phone: $phone\n";
    $email_body .= "Date: $date\n";
    $email_body .= "Time: $time\n";
    $email_body .= "Number of guests: $guests\n";
    $email_body .= "Special requests: " . ($special_requests ? $special_requests : "None") . "\n";
    
    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        // Send confirmation to user
        $user_subject = "Your LocalBites Reservation Confirmation";
        $user_message = "Dear $name,\n\nThank you for your reservation at LocalBites.\n\n";
        $user_message .= "Reservation Details:\n";
        $user_message .= "Date: $date\n";
        $user_message .= "Time: $time\n";
        $user_message .= "Party Size: $guests\n";
        $user_message .= "Special Requests: " . ($special_requests ? $special_requests : "None") . "\n\n";
        $user_message .= "We look forward to serving you!\n\n";
        $user_message .= "Best regards,\nThe LocalBites Team";
        mail($email, $user_subject, $user_message, $headers);
        
        echo json_encode(['success' => true, 'message' => 'Reservation submitted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'There was a problem processing your reservation. Please try again later.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>